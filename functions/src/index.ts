import { config, region } from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

import { twilioWebhookRouter } from './api/routes/twilio-webhook';
import { twilioRoutineRouter } from './api/routes/twilio-routine';

require('dotenv').config();
admin.initializeApp(config().firebase);

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const app = express();

app.use('/twilio/webhook', twilioWebhookRouter);
app.use('/twilio/routine', twilioRoutineRouter);

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/sendMessage', async (req, res) => {
  // tslint:disable-next-line:no-shadowed-variable
  const sendMessage = 'Hello from Node';
  client.messages
    .create({
      body: sendMessage,
      to: process.env.SAMPLE_PHONE_NUMBER,
      from: process.env.TWILIO_SEND_MESSAGE_NUMBER,
      //    from: functionConfig.phone_number.us_sms,
    })
    .then((message: any) => console.log(message));
  res.send(sendMessage);
});

app.get('/callPhone', async (req, res) => {
  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: process.env.SAMPLE_PHONE_NUMBER,
      from: process.env.TWILIO_RECEIVE_VOICE_NUMBER,
      timeout: 60,
      statusCallback: '/brute-force-calling/asia-northeast1/api/twilio/webhook/status',
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['ringing', 'answered', 'completed'],
      //    from: functionConfig.phone_number.jp_voice,
    })
    .then((call: any) => console.log(call));
  res.send('Hello from Firebase!');
});

app.get('/callDial', async (req, res) => {
  const twiml = new VoiceResponse();
  twiml.dial(
    {
      action: '/brute-force-calling/asia-northeast1/api/twilio/webhook/dial',
    },
    process.env.SAMPLE_PHONE_NUMBER,
  );
  twiml.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    'testtest',
  );
  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(twiml.toString());
});

export const api = region('asia-northeast1').https.onRequest(app);

export default app;
