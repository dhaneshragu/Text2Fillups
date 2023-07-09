# 🧠 Text2Fillups

Text2Fillups is a web-based application that allows users to generate fill-in-the-blank questions from given texts. This repository contains the code for both the backend server and the frontend user interface, as well as model training and inference notebooks.

## 🙌 Instructions to Get Started
- First of all `git clone` this repository and go to the appropriate folder in your local machine.
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
