const { google } = require("googleapis");
var shortUrl = require("node-url-shortener");
require("dotenv").config();

const CREDENTIALS_PATH = process.env.CRED_PATH;

const createItemObject = (questionObj, index) => {
  const { question, answer } = questionObj;
  const answerWords = answer
    .split(/[,;\s-:]+/)
    .filter((word) => word.trim() !== "");
  const wordCount = answerWords.length;

  const itemObject = {
    createItem: {
      item: {
        title: question,
        questionItem: {
          question: {
            required: false,
            grading: {
              pointValue: Math.max(1, Math.min(wordCount, 10)),
              correctAnswers: {
                answers: [
                  { value: answer },
                  { value: answer.toLowerCase() },
                  { value: answer.toUpperCase() },
                ],
              },
            },
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      location: {
        index: index,
      },
    },
  };

  return itemObject;
};

const createQuiz = async (req, res) => {
  const quizData = req.body.data;
  const formTitle = req.body.title ? req.body.title : "Quiz";
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/forms"],
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const forms = google.forms({ version: "v1", auth });

    const newForm = {
      info: {
        title: formTitle,
      },
    };

    const form = await forms.forms.create({
      requestBody: newForm,
    });

    const FORM_ID = form.data.formId;
    var FORM_LINK = form.data.responderUri;

    const update = {
      requests: [
        {
          updateSettings: {
            settings: {
              quizSettings: {
                isQuiz: true,
              },
            },
            updateMask: "quizSettings.isQuiz",
          },
        },
      ],
    };

    update.requests = [
      ...update.requests,
      ...quizData.map((questionObj, index) =>
        createItemObject(questionObj, index)
      ),
    ];

    const updateform = await forms.forms.batchUpdate({
      formId: FORM_ID,
      requestBody: update,
    });

    shortUrl.short(FORM_LINK, function (err, url) {
      if (err) {
        console.log("Error:", err);
        res.status(203).send({ link: FORM_LINK });
      } else {
        res.status(200).send({ link: url });
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(404)
      .send({ error: "An error occurred while creating the quiz." });
  }
};

module.exports = createQuiz;
