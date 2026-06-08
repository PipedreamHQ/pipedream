import fraudlabsProApp from "../../fraudlabs_pro.app.mjs";

export default {
  name: "Get Verification Result",
  description: "Verify that an OTP sent by the Send SMS Verification API is valid. [See the documentation](https://www.fraudlabspro.com/developer/api/get-sms-verification-result)",
  key: "fraudlabs_pro-verify-otp",
  version: "0.0.6",
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

    const response = await this.fraudlabsProApp.verifyOtp({
      $,
      params: {
        tran_id: tranId,
        otp,
        ...(format && {
          format,
        }),
      },
    });

    if (response?.error) {
      throw new Error(`Fraudlabs Pro response: error code ${response.error.error_code} - ${response.error.error_message}`);
    } else {
      $.export("$summary", "Successfully verified the OTP");
    }
    return response;
  },
};
