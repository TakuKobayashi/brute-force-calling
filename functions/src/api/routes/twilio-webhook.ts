import { NextFunction, Request, Response } from 'express';

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const twilioWebhookRouter = express.Router();

twilioWebhookRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello login');
});

twilioWebhookRouter.post('/voice', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: '/twilio/webhook/gather',
  });
  gather.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    '呼び出したい相手の電話番号を入力してください!!',
  );
  res.type('text/xml');
  res.send(twiml.toString());
});

twilioWebhookRouter.post('/status', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  res.send(req.body.text);
});

twilioWebhookRouter.post('/gather', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const twiml = new VoiceResponse();
  if (req.body.Digits) {
    if (req.body.Digits === '#') {
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
    twiml.redirect('/twilio/webhook/voice');
  }

  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(twiml.toString());
});

export { twilioWebhookRouter };
