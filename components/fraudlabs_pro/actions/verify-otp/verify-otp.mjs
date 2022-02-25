import  * as flpnodejs from 'fraudlabspro-nodejs';

export default {
  name: "Get Verification Result",
  description: "Verify that an OTP sent by the Send SMS Verification API is valid. Please refer to the [documentation](https://www.fraudlabspro.com/developer/api/get-result) for the explanation of the result returned.",
  key: "fraudlabs_pro-verify-otp",
  version: "0.0.1",
  type: "action",
  props: {
    flp_api_key: {
      type: "app",
      app: "fraudlabs_pro",
      description: "API license key. You can sign up for a trial key at [here](https://www.fraudlabspro.com/subscribe?id=1).",
    },
    tran_id: {
      type: "string",
      label: "tran_id",
      description: "The unique ID that was returned by the Send Verification SMS API that triggered the OTP sms.",
    },
    otp: {
      type: "string",
      label: "otp",
      description: "The OTP that was sent to the recipient’s phone.",
    },
    format: {
      type: "string",
      label: "Result Format",
      description: "*(optional)* Format of the result. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
},
async run() {

  var flp = new flpnodejs.SMSVerification(this.flp_api_key.$auth.api_key);

  const result_format = (typeof this.format === "undefined") ? "json" :`${this.format}`;

  var params = {
    tran_id: `${this.tran_id}`,
    format: result_format,
    otp: `${this.otp}`,
  };

  const process1 = await new Promise((resolve, reject) => {
    flp.verifyOTP(params, (err, data) => {
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