import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { TwilioVoice, TwilioVoiceState, TwilioGather } from '../../libs/interfaces/twilio-voice';

const firestore = admin.firestore();

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const twilioWebhookRouter = express.Router();

twilioWebhookRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello login');
});

twilioWebhookRouter.post('/voice', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.protocol + '://' + req.hostname + req.baseUrl);
  console.log(JSON.stringify(req.body));
  const voice: TwilioVoice = req.body;
  const twilioDocRef = firestore.collection('twilio-voice').doc(voice.From);
  const twilioResult = await twilioDocRef.set(voice).catch((err) => console.log(err));
  console.log(JSON.stringify(twilioResult || {}));

  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: req.baseUrl + '/gather',
  });
  gather.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    '呼び出したい相手の電話番号を入力して、最後にシャープを押してください',
  );
  res.type('text/xml');
  res.send(twiml.toString());
});

twilioWebhookRouter.post('/status', (req: Request, res: Response, next: NextFunction) => {
  console.log('Status');
  console.log(JSON.stringify(req.body));
  const voiceState: TwilioVoiceState = req.body;
  res.send(voiceState);
});

twilioWebhookRouter.post('/gather', (req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.stringify(req.body));
  const gather: TwilioGather = req.body;
  const twiml = new VoiceResponse();
  if (gather.Digits) {
    let phoneNumber = '+81';
    if (gather.Digits[0] === '0') {
      phoneNumber += gather.Digits.substr(1);
    }
    twiml.dial(
      {
        callerId: process.env.TWILIO_RECEIVE_VOICE_NUMBER,
        action: req.baseUrl + '/dial',
      },
      phoneNumber,
    );
    twiml.say(
      {
        language: 'ja-JP',
        voice: 'woman',
      },
      gather.Digits + 'にこれから電話をかけます!!',
    );
  } else {
    twiml.redirect(req.baseUrl + '/voice');
  }

  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(twiml.toString());
});

twilioWebhookRouter.post('/dial', (req: Request, res: Response, next: NextFunction) => {
  console.log('Dial');
  console.log(JSON.stringify(req.body));
  res.send(req.body);
});

export { twilioWebhookRouter };
