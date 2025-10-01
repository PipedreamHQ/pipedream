import fraudlabsProApp from "../../fraudlabs_pro.app.mjs";

export default {
  name: "Get Verification Result",
  description: "Verify that an OTP sent by the Send SMS Verification API is valid. Please refer to the [documentation](https://www.fraudlabspro.com/developer/api/get-result) for the explanation of the result returned.",
  key: "fraudlabs_pro-verify-otp",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fraudlabsProApp,
    tranId: {
      type: "string",
      label: "Transaction ID",
      description: "The unique ID that was returned by the Send Verification SMS API that triggered the OTP sms.",
    },
    otp: {
      type: "string",
      label: "OTP",
      description: "The OTP that was sent to the recipient’s phone.",
    },
    format: {
      propDefinition: [
        fraudlabsProApp,
        "format",
      ],
    },
  },
  async run({ $ }) {

    const {
      tranId,
      otp,
      format,
    } = this;
    const response =
    await this.fraudlabsProApp.verifyOtp({
      tran_id: tranId,
      format: format ?? "json",
      otp,
    });
    if ("error" in response) {
      throw new Error(`Fraudlabs Pro response: error code ${response.error.error_code} - ${response.error.error_message}`);
    } else {
      $.export("$summary", "Successfully verified the OTP");
    }
    return response;
  },
};
