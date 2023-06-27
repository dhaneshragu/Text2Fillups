from nltk import sent_tokenize
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from tqdm import tqdm
from transformers import(
    AutoModelForSeq2SeqLM,
    AutoTokenizer, T5Tokenizer, T5ForConditionalGeneration
)
import pandas as pd
import numpy as np
import re
import sys
sys.path.append("question_generation/question_generation")
nltk.download('punkt')
from pipelines import pipeline

app = Flask(__name__)
CORS(app, support_credentials=True)

########################### GLOBAL VARIABLES ###############################################
model = None
ans_model = None
tokenizer = None
ans_tokenizer = None
nlp = None
fillups_model = None
fillups_tokenizer = None


##################### UTILS ###################################
def getDeclarative(answer, question):
    "Convert to fillups"
    global fillups_model, fillups_tokenizer
    inputs_encoding =  fillups_tokenizer(
        question,
        answer,
        add_special_tokens=True,
        max_length= 512,
        padding = 'max_length',
        truncation='only_first',
        return_attention_mask=True,
        return_tensors="pt"
        )

    
    generate_ids = fillups_model.generate(
        input_ids = inputs_encoding["input_ids"],
        attention_mask = inputs_encoding["attention_mask"],
        max_length = 128,
        num_beams = 4,
        num_return_sequences = 1,
        no_repeat_ngram_size=2,
        early_stopping=True,
        )

    preds = [
        fillups_tokenizer.decode(gen_id,
        skip_special_tokens=True, 
        clean_up_tokenization_spaces=True)
        for gen_id in generate_ids
    ]

    return "".join(preds)


def check(a,b):
    """For better quality questions, answers shoudnt be present in questions"""
    a = re.sub(r'[^\w\s]', '', a.lower())
    b = re.sub(r'[^\w\s]', '', b.lower())
    if a in b:
        return True
    else:
        return False

def split_into_groups(paragraph, max_sentences):
    """
    Splits the paragraphs into groups depending on max_sentences
    """
    sentences = sent_tokenize(paragraph)
    num_groups = len(sentences) // max_sentences
    if len(sentences) % max_sentences != 0:
        num_groups += 1

    groups = []
    for i in range(num_groups):
        start = i * max_sentences
        end = (i+1) * max_sentences
        groups.append(sentences[start:end])

    final_groups = []
    for group in groups:
        final_groups.append(' '.join(group))
    return final_groups

def get_qna(text, limit=5):
    """
          Gets the question, answer pairs equal to the parameter specified by limit from the split passage
    """
    global nlp,model
    pattern = r"\n[A-Z\s]+\n"
    split_words = re.findall(pattern, text)
    if(split_words):
        regex_pattern = '|'.join(split_words)
        split_passage = re.split(regex_pattern, text)[1:]
    else:
        pattern = r"\n{2,}"
        split_passage = re.split(pattern, text)

    qa_list = []
    done = False

    for i in tqdm(range(len(split_passage))):
        if done:
            break
        try:
            if(len(sent_tokenize(split_passage[i])) > 4):
                groups = split_into_groups(split_passage[i], max_sentences=5)
                for group in groups:
                    x = nlp(group)
                    for ele in x:
                        if '?' in ele['question']:
                            if(check(ele['answer'], ele['question'])):
                                continue
                            ele["question"] = ele["question"].rstrip("?") + " ?"
                            declarative = getDeclarative(ele["answer"], ele["question"])
            
                            if re.search(re.escape(ele["answer"]),declarative, flags=re.IGNORECASE):
                                 reg = re.compile(re.escape(ele["answer"]), re.IGNORECASE)
                                 fillups_final = re.sub(reg, "__________", declarative)       
                                 qa_list.append({"question": fillups_final , "answer": ele["answer"]})

                            if(len(qa_list) >= limit):
                                done = True
                                break
            else:
                x = nlp(split_passage[i])

                for ele in x:
                        if '?' in ele['question']:
                            if(check(ele['answer'], ele['question'])):
                                continue
                            ele["question"] = ele["question"].rstrip("?") + " ?"
                            declarative = getDeclarative(ele["answer"], ele["question"])
                    
                            if re.search(re.escape(ele["answer"]),declarative, flags=re.IGNORECASE):
                                 reg = re.compile(re.escape(ele["answer"]), re.IGNORECASE)
                                 fillups_final = re.sub(reg, "__________", declarative)       
                                 qa_list.append({"question": fillups_final , "answer": ele["answer"]})
      
                            if(len(qa_list) >= limit):
                                done = True
                                break
        except:
            pass
    return {"data": qa_list}

def model_loader():
    global model, ans_model, tokenizer, ans_tokenizer, nlp, fillups_model, fillups_tokenizer
    model_name = 'valhalla/t5-base-qg-hl'
    ans_model_name = 'valhalla/t5-small-qa-qg-hl'
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    ans_model = AutoModelForSeq2SeqLM.from_pretrained(ans_model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    ans_tokenizer = AutoTokenizer.from_pretrained(ans_model_name)
    nlp = pipeline("question-generation", model=model, tokenizer=tokenizer,
                   ans_tokenizer=ans_tokenizer, ans_model=ans_model, use_cuda=True,
                   ans_max_length= 16, ques_max_length=512, num_beams=2)
    fillups_tokenizer = T5Tokenizer.from_pretrained('t5-base', model_max_length= 512)
    fillups_model = T5ForConditionalGeneration.from_pretrained("DhaneshV/T2Fillups")




########################### ROUTES ##################################
@app.route('/flask', methods=['GET'])
@cross_origin(supports_credentials=True)
def flask():
    return jsonify({"data": "I am from Flask"})


@app.route('/load-model', methods=['GET'])
@cross_origin(supports_credentials=True)
def load_model():
    if(fillups_model is None):
        model_loader()
    return "Model Loaded"


@app.route('/get-qna', methods=['POST'])
@cross_origin(supports_credentials=True)
def questions():
    input_text = request.json["input"]
    limit = request.json["limit"]
    data = get_qna(input_text,limit)
    return jsonify(data)


###################### MAIN #######################################
if __name__ == "__main__":
    if(fillups_model is None):
        model_loader()
    app.run(port=8000, debug=True)
