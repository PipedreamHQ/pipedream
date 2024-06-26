import app from "../../myotp_app.app.mjs";

export default {
  key: "myotp_app-verify-otp",
  name: "Verify OTP",
  description: "Validate the OTP for successful verification. [See the documentation](https://api.myotp.app/swagger-ui/#/default/verify_otp_endpoint)",
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
    messageID: {
      propDefinition: [
        app,
        "messageID",
      ],
    },
    otp: {
      propDefinition: [
        app,
        "otp",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyOTP({
      $,
      data: {
        phone_number: this.phoneNumber,
        message_id: this.messageID,
        otp: this.otp,
      },
    });

    $.export("$summary", `Successfully verified OTP. Status: ${response.status}`);

    return response;
  },
};
