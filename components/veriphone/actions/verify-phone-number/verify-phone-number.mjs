import veriphone from "../../veriphone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "veriphone-verify-phone-number",
  name: "Verify Phone Number",
  description: "Validates the given phone number using Veriphone. [See the documentation](https://veriphone.io/docs/v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    veriphone,
    phoneNumber: {
      propDefinition: [
        veriphone,
        "phoneNumber",
      ],
    },
    defaultCountry: {
      propDefinition: [
        veriphone,
        "defaultCountry",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.veriphone.verifyPhoneNumber({
      phoneNumber: this.phoneNumber,
      defaultCountry: this.defaultCountry,
    });

    const summary = `The phone number ${response.phone} validation status is ${response.phone_valid
      ? "valid"
      : "invalid"}`;
    $.export("$summary", summary);
    return response;
  },
};
