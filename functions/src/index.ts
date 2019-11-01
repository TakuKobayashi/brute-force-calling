import * as functions from 'firebase-functions';

const accountSid = 'ACe6324e501c8e4dc25a1f7f1a5351a1a3';
const authToken = 'c2896e441f27b31849daf4daa4bf75f0';
require('twilio')(accountSid, authToken);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
