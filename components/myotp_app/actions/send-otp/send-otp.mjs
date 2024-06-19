import app from "../../myotp_app.app.mjs";

export default {
  key: "myotp_app-send-otp",
  name: "Send OTP",
  description: "Generate a One Time Password (OTP) and send it to the specified phone number. [See the documentation](https://api.myotp.app/swagger-ui/#/default/generate_otp_endpoint)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    otpValidity: {
      propDefinition: [
        app,
        "otpValidity",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendOTP({
      $,
      data: {
        phone_number: this.phoneNumber,
        otp_validity: this.otpValidity,
      },
    });

    $.export("$summary", `Successfully sent OTP. Valid until '${response.expires_at}'`);

    return response;
  },
};
