import veriphone from "../../veriphone.app.mjs";

export default {
  key: "veriphone-verify-phone-number",
  name: "Verify Phone Number",
  description: "Validates the given phone number using Veriphone. [See the documentation](https://veriphone.io/docs/v2#:~:text=support%40veriphone.io-,VERIFY,-Veriphone%27s%20/v2/verify)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    veriphone,
    phoneNumber: {
      propDefinition: [
        veriphone,
        "phoneNumber",
      ],
    },
    countryCode: {
      propDefinition: [
        veriphone,
        "countryCode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.veriphone.verifyPhoneNumber({
      $,
      params: {
        phone: this.phoneNumber,
        country_code: this.countryCode,
      },
    });

    $.export("$summary", `The phone number ${this.phoneNumber} has been successfully verified!`);
    return response;
  },
};
