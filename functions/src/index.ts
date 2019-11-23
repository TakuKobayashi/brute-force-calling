import { region, Request, Response, config } from 'firebase-functions';

import { region, config } from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';

require('dotenv').config();

admin.initializeApp(config().firebase);
const firestore = admin.firestore();
const storage = admin.storage();
const app = express();

require('dotenv').config();

const VoiceResponse = require('twilio').twiml.VoiceResponse;
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

export const statusWebhook = region('asia-northeast1').https.onRequest((request: Request, response: Response) => {
  if (request.method !== 'POST') {
    response.send('This is not post request');
  }
  console.log(request.body);
  response.send(request.body.text);
});

export const voiceWebhook = region('asia-northeast1').https.onRequest((request: Request, response: Response) => {
  const twiml = new VoiceResponse();
  if (request.method !== 'POST') {
    twiml.say(
      {
        language: 'ja-JP',
        voice: 'woman',
      },
      'そのリクエストは受け付けていません',
    );
    response.send(twiml.toString());
    return;
  }
  console.log(request.body);

  const gather = twiml.gather({
    action: 'https://asia-northeast1-brute-force-calling.cloudfunctions.net/gatherWebhook',
  });
  gather.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    'ブルートフォースコーリングをお使いいただきありがとうございます!!呼び出したい相手の電話番号を入力してください!!',
  );
  response.type('text/xml');
  response.send(twiml.toString());
});

export const gatherWebhook = region('asia-northeast1').https.onRequest((request: Request, response: Response) => {
  const twiml = new VoiceResponse();
  if (request.method !== 'POST') {
    twiml.say(
      {
        language: 'ja-JP',
        voice: 'woman',
      },
      'そのリクエストは受け付けていません',
    );
    response.send(twiml.toString());
    return;
  }
  console.log(request.body);

  if (request.body.Digits) {
    if (request.body.Digits === '#') {
      twiml.say(
        {
          language: 'ja-JP',
          voice: 'woman',
        },
        'それではこれから電話をかけます!!',
      );
    } else {
      // 記録していく
    }
  } else {
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

export const api = region('asia-northeast1').https.onRequest(app);

export default app;
