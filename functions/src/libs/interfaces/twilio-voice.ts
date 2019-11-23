export interface TwilioVoice {
  Called: string;
  ToState: string;
  CallerCountry: string;
  Direction: string;
  CalledVia: string;
  CallerState: string;
  ToZip: string;
  CallSid: string;
  To: string;
  CallerZip: string;
  ToCountry: string;
  ApiVersion: string;
  CalledZip: string;
  CallStatus: string;
  From: string;
  AccountSid: string;
  CalledCountry: string;
  CallerCity: string;
  Caller: string;
  FromCountry: string;
  ToCity: string;
  FromCity: string;
  CalledState: string;
  ForwardedFrom: string;
  FromZip: string;
  FromState: string;
}

export interface TwilioVoiceState extends TwilioVoice {
  Timestamp: string;
  CallbackSource: string;
  SequenceNumber: string;
  CalledCity: string;
  Duration: string;
  CallDuration: string;
}

export interface TwilioGather extends TwilioVoice {
  msg: string;
  Digits: string;
}
