'use strict'

require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http')
const unirest = require('unirest')

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const casper_key = process.env.CASPER_KEY;
const casper_url = process.env.CASPER_URL;
const eventUrl = process.env.EVENT_URL

app.use(bodyParser.json())

//const privateKey = require('fs').readFileSync('private.key');

app.get('/webhooks/answer', (request, response) => {

  const ncco = [{
      action: 'talk',
      text: 'Hi, describe an image that you want to generate'
    },
    {
      eventMethod: 'POST',
      action: 'input',
      eventUrl: [
        eventUrl],
      type: [ "speech" ],
      speech: {
        language: 'en-gb',
        endOnSilence: 0.5
      }
    },
    {
      action: 'talk',
      text: 'Thank you'
    }
  ]
  console.log('/webhooks/answer')
  response.json(ncco)
  
})

app.post('/webhooks/asr', (request, response) => {

    console.log(request.body)
    console.log(request.body.speech.results[0].text)
    console.log(request.body.from)
    let phoneNumber = request.body.from
    console.log(request.body.timestamp)
    let promptText = request.body.speech.results[0].text
    
    var req = unirest('POST', casper_url)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + casper_key
    })
    .send(JSON.stringify({
      "prompt": promptText
    }))
    .end(function (res) { 
      
      if (res.error) throw new Error(res.error); 
      console.log(res.raw_body);
      ncco = [{
        action: 'talk',
        text: `res.raw_body`
      }]
    });

    ncco = [{
      action: 'talk',
      text: `This is a test`
    }]
    response.json(ncco)
    
  })




app.post('/webhooks/events', (request, response) => {
    
    console.log('/webhooks/events')
    console.log(request.body)
    response.sendStatus(200);  
  })

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))