const express = require('express');
const cors = require('cors');
const createQuiz =  require('./controllers/CreateGoogleForm');
const getFillups = require('./controllers/FillupsController');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.post('/get-fillups' , getFillups);
app.post('/create-form', createQuiz);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});