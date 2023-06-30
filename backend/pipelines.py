import itertools
import logging
from typing import Optional, Dict, Union

from nltk import sent_tokenize

import torch
from transformers import(
    AutoModelForSeq2SeqLM, 
    AutoTokenizer,
    PreTrainedModel,
    PreTrainedTokenizer,
)

logger = logging.getLogger(__name__)

class QGPipeline:
    """Poor man's QG pipeline"""
    def __init__(
        self,
        model: PreTrainedModel,
        tokenizer: PreTrainedTokenizer,
        ans_model: PreTrainedModel,
        ans_tokenizer: PreTrainedTokenizer,
        qg_format: str,
        use_cuda: bool,
        ans_max_length: int,
        ques_max_length: int,
        num_beams: int,
    ):
        self.model = model
        self.tokenizer = tokenizer

        self.ans_model = ans_model
        self.ans_tokenizer = ans_tokenizer

        self.qg_format = qg_format
        self.ans_max_length = ans_max_length
        self.ques_max_length = ques_max_length
        self.num_beams = num_beams


        self.device = "cuda" if torch.cuda.is_available() and use_cuda else "cpu"
        self.model.to(self.device)
        self.ans_model.to(self.device)

#         assert self.model._class.name_ in ["T5ForConditionalGeneration", "BartForConditionalGeneration"]
        
#         if "T5ForConditionalGeneration" in self.model._class.name_:
#             self.model_type = "t5"
#         else:
#             self.model_type = "bart"

        self.model_type = "t5"

    def __call__(self, inputs: str):
        inputs = " ".join(inputs.split())
        sents, answers = self._extract_answers(inputs)
        flat_answers = list(itertools.chain(*answers))
        
        if len(flat_answers) == 0:
          return []

        if self.qg_format == "prepend":
            qg_examples = self._prepare_inputs_for_qg_from_answers_prepend(inputs, answers)
        else:
            qg_examples = self._prepare_inputs_for_qg_from_answers_hl(sents, answers)
        
        qg_inputs = [example['source_text'] for example in qg_examples]
        questions = self._generate_questions(qg_inputs)
        output = [{'answer': example['answer'], 'question': que} for example, que in zip(qg_examples, questions)]
        return output
    
    def _generate_questions(self, inputs):
        inputs = self._tokenize(inputs, padding=True, truncation=True)
        
        outs = self.model.generate(
            input_ids=inputs['input_ids'].to(self.device), 
            attention_mask=inputs['attention_mask'].to(self.device), 
            max_length= self.ques_max_length,
            num_beams = self.num_beams,
        )
        
        questions = [self.tokenizer.decode(ids, skip_special_tokens=True) for ids in outs]
        return questions
    
    def _extract_answers(self, context):
        sents, inputs = self._prepare_inputs_for_ans_extraction(context)
        inputs = self._tokenize(inputs, padding=True, truncation=True)

        outs = self.ans_model.generate(
            input_ids=inputs['input_ids'].to(self.device), 
            attention_mask=inputs['attention_mask'].to(self.device), 
            max_length= self.ans_max_length,
        )
        
#         dec = [self.ans_tokenizer.decode(ids, skip_special_tokens=False) for ids in outs]
        dec = [self.ans_tokenizer.decode(ids, skip_special_tokens=True) for ids in outs]
        answers = [item.split('<sep>') for item in dec]
        answers = [i[:-1] for i in answers]
#         answers = answers[:4]
        
        return sents, answers
    
    def _tokenize(self,
        inputs,
        padding=True,
        truncation=True,
        add_special_tokens=True,
        max_length=512
    ):
        inputs = self.tokenizer.batch_encode_plus(
            inputs, 
            max_length=max_length,
            add_special_tokens=add_special_tokens,
            truncation=truncation,
            padding="max_length" if padding else False,
            pad_to_max_length=padding,
            return_tensors="pt"
        )
        return inputs
    
    def _prepare_inputs_for_ans_extraction(self, text):
        sents = sent_tokenize(text)

        inputs = []
        for i in range(len(sents)):
            source_text = "extract answers:"
            for j, sent in enumerate(sents):
                if i == j:
                    sent = "<hl> %s <hl>" % sent
                source_text = "%s %s" % (source_text, sent)
                source_text = source_text.strip()
            
            if self.model_type == "t5":
                source_text = source_text + " </s>"
            inputs.append(source_text)

        return sents, inputs
    
    def _prepare_inputs_for_qg_from_answers_hl(self, sents, answers):
        inputs = []
        for i, answer in enumerate(answers):
            if len(answer) == 0: continue
            for answer_text in answer:
                sent = sents[i]
                sents_copy = sents[:]
                
                answer_text = answer_text.strip()
                
#                 ans_start_idx = sent.index(answer_text)
                try:
                    ans_start_idx = sent.index(answer_text)
                except:
                    continue
                
                sent = f"{sent[:ans_start_idx]} <hl> {answer_text} <hl> {sent[ans_start_idx + len(answer_text): ]}"
                sents_copy[i] = sent
                
                source_text = " ".join(sents_copy)
                source_text = f"generate question: {source_text}" 
                if self.model_type == "t5":
                    source_text = source_text + " </s>"
                
                inputs.append({"answer": answer_text, "source_text": source_text})
        
        return inputs
    
    def _prepare_inputs_for_qg_from_answers_prepend(self, context, answers):
        flat_answers = list(itertools.chain(*answers))
        examples = []
        for answer in flat_answers:
            source_text = f"answer: {answer} context: {context}"
            if self.model_type == "t5":
                source_text = source_text + " </s>"
            
            examples.append({"answer": answer, "source_text": source_text})
        return examples

    

SUPPORTED_TASKS = {
    "question-generation": {
        "impl": QGPipeline,
        "default": {
            "model": "valhalla/t5-small-qg-hl",
            "ans_model": "valhalla/t5-small-qa-qg-hl",
        }
    }
}

def pipeline(
    task: "question-generation",
    model: PreTrainedModel = None,
    tokenizer: PreTrainedTokenizer = None,
    qg_format: Optional[str] = "highlight",
    ans_model: PreTrainedModel = None,
    ans_tokenizer: PreTrainedTokenizer = None,
    use_cuda: Optional[bool] = True,
    ans_max_length: Optional[int] = 32,
    ques_max_length: Optional[int] = 32,
    num_beams: Optional[int] = 4,
    **kwargs,
):
  return QGPipeline(model=model, tokenizer=tokenizer, ans_model=ans_model, ans_tokenizer=ans_tokenizer, qg_format=qg_format, use_cuda=use_cuda,
  ans_max_length = ans_max_length, ques_max_length = ques_max_length, num_beams = num_beams)
