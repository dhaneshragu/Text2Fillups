<h1 align="center">Text2Fillups</h1>
<p align="center">
<img src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/1abdd222-1572-4a8c-be9b-2c59bbdbcf89" width="200px"/>
</p>
Text2Fillups is a web-based ML application that allows users to generate fill-in-the-blank questions from given texts. This repository contains the code for both the backend server and the frontend user interface, as well as model training and inference notebooks.

## 📕 Tech stack
<p>
<img src="https://img.shields.io/badge/Pytorch-EE4C2C?logo=pytorch&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/WandB-FFBE00?logo=weightsandbiases&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/ONNX-005CED?logo=onnx&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/React.js-61DAFB?logo=react&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat" />
<img src="https://img.shields.io/badge/Google Forms-B366F6?logo=googlesheets&logoColor=white&style=flat" />
</p>

## 📽️ Video demo
https://github.com/dhaneshragu/Text2Fillups/assets/95169037/15c66139-2e3b-4acb-9daf-d01951b689ea

## 🔥 Web-app Features
### 💻 Stylish glassmorphism UI
<img width="540" alt="image" src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/ba89ac82-9778-434f-99e9-06b80f51ea39">

- The UI has been created using material-ui react library. 

### 📜 Toggle Feature for questions
<img src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/22bc462a-9a5b-4887-afd5-839da8641d53" width="540px">

- The toggle feature has been implemented in the question answer cards to hide and unhide the answers.

### 🍞 Toast Messages
<img width="540px" alt="image" src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/e7997ce2-3b33-41f2-b091-3f669e542c6f">

- Toast messages are displayed wherever necessary, to indicate a completion of a process, for a better accessibility.

### 🔗 Google Quiz link
<img src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/cb7dfc27-f268-49da-ab91-ef24de94d022" width="540px">
<img width="540px" alt="image" src="https://github.com/dhaneshragu/Text2Fillups/assets/95169037/21b2f779-e251-4362-a6b8-25730f3efdf6">

- Google quiz link is readily generated for assessment of the topic.


## 🧠 Overview 
1. The text corpus is taken as input from the user and question-answer pairs are generated using the t-5 transformer model from [hugging face](https://github.com/patil-suraj/question_generation) for the task of **context-aware question generation**. (generates question and answer pairs using a context).
2. Then these question-answer pairs are converted to normal sentences (For e.g.: `{"Question":"What is your name ?", "Answer":"Dhanesh"}` is converted to "My name is Dhanesh")
using t-5 transformer fine-tuned on QA2D dataset.
3. The fine-tuned model is pushed in [hugging-face hub](https://huggingface.co/DhaneshV/T2FPipeline) for further usage.
4. To reduce the inference time and reduce the model size, I have quantized the fine-tuned transformer using ONNX and fast-t5 library that reduced the size of the model from around 900MB to around 400MB. The models and relevant notebooks are uploaded in `Fine-tuning-notebook/Quantized-model`.
5. The answer word is blanked and displayed in the web app with a toggle feature.
6. Additionally, a Google quiz link containing all these questions is created using google forms API in the backend, which can be shared to test the topic readily.

## 🙌 Instructions to Get Started
- First of all, `git clone` this repository and go to the appropriate folder in your local machine.

### 📜 Getting credentials for GoogleFormsAPI
1. Create an account on https://console.cloud.google.com/ and create a new project.
2. In the `API & Services` section enable the API for `Google Forms`.
3. Generate a new `OAuth 2.0 Client ID` and download the json file containing `Client_ID` and `Client_Secrets`.
4. Save this json as `credentials.json` in the `backend` folder.

### 🔌 Backend Server
1. Navigate to the folder where this repository is cloned.
2. Open the terminal and navigate to the `backend` directory using the command: `cd backend`.
3. Install the required dependencies by running: `npm install`.
4. Start the backend server by running: `npm start`.
5. Install the Python dependencies by running: `pip install -r requirements.txt`.
6. Run the Flask application by executing: `python app.py`.

### 👤 Frontend User Interface

1. Open a new terminal window.
2. Navigate to the `frontend` directory using the command: `cd frontend`.
3. Install the necessary dependencies by running: `npm install`.
4. Start the frontend development server by running: `npm start`.

That's it! You are now ready to use Text2Fillups and generate fill-in-the-blank questions from texts. Enjoy! 🚀📚

## 🦾 Contributors
- [Dhanesh](https://github.com/dhaneshragu) ,CSE , IIT Guwahati.
## 🌟 Stay connected
Don't forget to ⭐️ star this repository to show your support and stay connected for future updates!
