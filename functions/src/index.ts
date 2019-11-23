import { region, Request, Response, config } from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';

import { twilioWebhookRouter } from './api/routes/twilio-webhook';

require('dotenv').config();

admin.initializeApp(config().firebase);
//const firestore = admin.firestore();
//const storage = admin.storage();
const app = express();

app.use('/twilio/webhook', twilioWebhookRouter);

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

export const sendMessage = region('asia-northeast1').https.onRequest((request: Request, response: Response) => {
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
  response.send(sendMessage);
});

export const callPhone = region('asia-northeast1').https.onRequest((request: Request, response: Response) => {
  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: process.env.SAMPLE_PHONE_NUMBER,
      from: process.env.TWILIO_RECEIVE_VOICE_NUMBER,
      timeout: 60,
      statusCallback: 'https://asia-northeast1-brute-force-calling.cloudfunctions.net/statusWebhook',
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['ringing', 'answered', 'completed'],
      //    from: functionConfig.phone_number.jp_voice,
    })
    .then((call: any) => console.log(call));
  response.send('Hello from Firebase!');
});

export const api = region('asia-northeast1').https.onRequest(app);

export default app;
