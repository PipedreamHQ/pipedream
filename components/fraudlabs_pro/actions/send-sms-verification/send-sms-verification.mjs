import fraudlabsProApp from "../../fraudlabs_pro.app.mjs";

export default {
  name: "Send SMS Verification",
  description: "Send an SMS with verification code and a custom message for authentication purpose. NOTE: Make sure you have enough SMS credits to send any verification SMS. [See the documentation](https://www.fraudlabspro.com/developer/api/send-sms-verification)",
  key: "fraudlabs_pro-send-sms-verification",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fraudlabsProApp,
    tel: {
      type: "string",
      label: "Telephone Number",
      description: "The recipient mobile phone number in E164 format which is a plus followed by just numbers with no spaces or parentheses. For example, `+12015550123`",
    },
    mesg: {
      type: "string",
      label: "Message",
      description: "The message template for the SMS. Add <otp> as placeholder for the actual OTP to be generated. Max length is 140 characters. For example, `Your OTP for the transaction is <otp>`",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "*(optional)* ISO 3166 country code for the recipient mobile phone number. If parameter is supplied, then some basic telephone number validation is done.",
      optional: true,
    },
    format: {
      propDefinition: [
        fraudlabsProApp,
        "format",
      ],
    },
    otpTimeout: {
      type: "string",
      label: "OTP Timeout",
      description: "*(optional)* Timeout feature for OTP value in seconds. Default is `3600` seconds(1 hour). Min timeout is 15 seconds whereas max timeout is `86400` seconds(24 hours).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      tel,
      mesg,
      countryCode,
      format,
      otpTimeout,
    } = this;

    const response = await this.fraudlabsProApp.sendSmsVerification({
      $,
      data: {
        tel,
        mesg,
        ...(format && {
          format,
        }),
        ...(countryCode && {
          country_code: countryCode,
        }),
        ...(otpTimeout && {
          otp_timeout: otpTimeout,
        }),
      },
    });

    if (response?.error) {
      throw new Error(`Fraudlabs Pro response: error code ${response.error.error_code} - ${response.error.error_message}`);
    } else {
      $.export("$summary", "Successfully sent SMS verification");
    }
    return response;
  },
};
