const request = require('request-promise')
require('dotenv').config();

  const getFillups = async(req,res) => {
    const options = {
      uri: `${process.env.FLASK_PATH}/get-qna`,
      method: 'POST',
      json: true,
      body: {
        input : req.body.input,
        limit : req.body.limit ? req.body.limit : 5
      }
    };

    var QnA = await request(options)
      .then(response => {
        res.status(200).send(response);
        
      })
      .catch(error => {
        console.error('Error:', error.message);
        res.status(404).send({error:"Some error occured while getting the fillups"});
      });


  }


module.exports = getFillups;
