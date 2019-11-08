import {region, Request, Response} from "firebase-functions";

const accountSid = 'ACe6324e501c8e4dc25a1f7f1a5351a1a3';
const authToken = 'c2896e441f27b31849daf4daa4bf75f0';
const client = require('twilio')(accountSid, authToken);

export const sendMessage = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  // tslint:disable-next-line:no-shadowed-variable
  const sendMessage = 'Hello from Node';
  client.messages.create({
    body: sendMessage,
    to: '+818055146460',
    from: '+17164076874',
  }).then((message: any) => console.log(message));
  response.send(sendMessage);
});

export const callPhone = region("asia-northeast1").https.onRequest((request: Request, response: Response) => {
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+818055146460',
    from: '+17164076874',
  }).then((call: any) => console.log(call));
  response.send("Hello from Firebase!");
});
