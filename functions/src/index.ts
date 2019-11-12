import {region, Request, Response, config} from "firebase-functions";
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/*
const functionConfig = config();
console.log(functionConfig);
console.log(process.env);
const client = require('twilio')(functionConfig.twilio.account_sid, functionConfig.twilio.auth_token);
*/
const accountSid = 'ACe6324e501c8e4dc25a1f7f1a5351a1a3';
const authToken = 'c2896e441f27b31849daf4daa4bf75f0';
const client = require('twilio')(accountSid, authToken);


export const settingConfig = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  response.json(config());
});

export const sendMessage = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  // tslint:disable-next-line:no-shadowed-variable
  const sendMessage = 'Hello from Node';
  client.messages.create({
    body: sendMessage,
    to: '+818055146460',
    from: '+17164076874',
//    from: functionConfig.phone_number.us_sms,
  }).then((message: any) => console.log(message));
  response.send(sendMessage);
});

export const callPhone = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+818055146460',
    from: '+17164076874',
    timeout: 60,
    statusCallback: 'https://asia-northeast1-brute-force-calling.cloudfunctions.net/statusWebhook',
    statusCallbackMethod: "POST",
    statusCallbackEvent: ["ringing", "answered", "completed"]
    //    from: functionConfig.phone_number.jp_voice,
  }).then((call: any) => console.log(call));
  response.send("Hello from Firebase!");
});

export const statusWebhook = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  if (request.method !== 'POST') {
    response.send('This is not post request')
  }
  console.log(request.body)
  response.send(request.body.text)
});

export const voiceWebhook = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  const twiml = new VoiceResponse();
  if (request.method !== 'POST') {
    twiml.say('そのリクエストは受け付けていません');
    response.send(twiml.toString());
    return;
  }
  console.log(request.body)

  const gather = twiml.gather({
    action: 'https://asia-northeast1-brute-force-calling.cloudfunctions.net/gatherWebhook'
  });
  gather.say('ブルートフォースコーリングをお使いいただきありがとうございます!!呼び出したい相手の電話番号を入力してください!!');
  response.type('text/xml');
  response.send(twiml.toString());
});


export const gatherWebhook = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  const twiml = new VoiceResponse();
  if (request.method !== 'POST') {
    twiml.say('そのリクエストは受け付けていません');
    response.send(twiml.toString());
    return;
  }
  console.log(request.body)

  if (request.body.Digits) {
    if(request.body.Digits === '#'){
      twiml.say('それではこれから電話をかけます!!');
    }else{
      // 記録していく
    }
  } else {
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

