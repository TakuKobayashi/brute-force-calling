import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';

const firestore = admin.firestore();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const express = require('express');
const twilioRoutineRouter = express.Router();

twilioRoutineRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello routine');
});

// cronで定期的に叩かれるべきエンドポイント
twilioRoutineRouter.post('/recall', async (req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.stringify(req.body));
  const twilioVoices = await firestore.collection('twilio-voice').get();
  const resultPromise: Promise<CallInstance>[] = [];
  for (const doc of twilioVoices.docs) {
    const data = doc.data();
    // 電話に出なくて保留されている番号に電話をかける
    const calledPromise = client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: data.To,
      from: process.env.TWILIO_RECEIVE_VOICE_NUMBER,
      timeout: 40,
      statusCallback: '/brute-force-calling/asia-northeast1/api/twilio/webhook/status',
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['ringing', 'answered', 'completed'],
    });
    resultPromise.push(calledPromise);
  }
  const results = await Promise.all(resultPromise);
  res.json(results);
});

export { twilioRoutineRouter };
