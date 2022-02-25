import  * as flpnodejs from 'fraudlabspro-nodejs';

export default {
  name: "Send SMS Verification",
  description: "Send an SMS with verification code and a custom message for authentication purpose. Please refer to the [documentation](https://www.fraudlabspro.com/developer/api/send-verification) for the explanation of the result returned. NOTE: You need to register for an API key before using this REST API. Please visit [Micro Plan](https://www.fraudlabspro.com/sign-up) to sign up for an API key if you do not have one. In addition, you will also have to make sure you have enough SMS credits to send any verification SMS.",
  key: "fraudlabs_pro-send-sms-verification",
  version: "0.0.1",
  type: "action",
  props: {
    flp_api_key: {
      type: "app",
      app: "fraudlabs_pro",
      description: "API license key. You can sign up for a trial key at [here](https://www.fraudlabspro.com/subscribe?id=1).",
    },
    tel: {
      type: "string",
      label: "tel",
      description: "The recipient mobile phone number in E164 format which is a plus followed by just numbers with no spaces or parentheses. For example, `+123456789`",
    },
    mesg: {
      type: "string",
      label: "mesg",
      description: "The message template for the SMS. Add <otp> as placeholder for the actual OTP to be generated. Max length is 140 characters. For example, `Your OTP for the transaction is <otp>`",
    },
    country_code: {
      type: "string",
      label: "country_code",
      description: "*(optional)* ISO 3166 country code for the recipient mobile phone number. If parameter is supplied, then some basic telephone number validation is done.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Result Format",
      description: "*(optional)* Format of the result. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
    otp_timeout: {
      type: "string",
      label: "otp_timeout",
      description: "*(optional)* Timeout feature for OTP value in seconds. Default is `3600` seconds(1 hour). Min timeout is 15 seconds whereas max timeout is `86400` seconds(24 hours).",
      optional: true,
    },
},
async run() {

  var flp = new flpnodejs.SMSVerification(this.flp_api_key.$auth.api_key);

  const result_format = (typeof this.format === "undefined") ? "json" :`${this.format}`;

  var params = {
    tel: `${this.tel}`,
    format: result_format,
    mesg: `${this.mesg}`,
    country_code: (typeof this.country_code === "undefined") ? "" :`${this.country_code}`,
    otp_timeout: (typeof this.otp_timeout === "undefined") ? "" :`${this.otp_timeout}`,
  };

  const process1 = await new Promise((resolve, reject) => {
    flp.sendSMS(params, (err, data) => {
      if (err) {
        reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return        // and we don't want to go any further
      }
      resolve(data)
    })})
    .then(data => {
    //console.log(data);
    return (data);
    })
    .catch(err => {console.error(err)});
  return process1;
},
}