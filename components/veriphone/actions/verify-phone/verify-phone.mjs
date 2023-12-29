import veriphone from "../../veriphone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "veriphone-verify-phone",
  name: "Verify Phone Number",
  description: "Checks the validity of a given phone number. [See the documentation](https://veriphone.io/docs/v2)",
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

    $.export("$summary", `The phone number ${this.phoneNumber} has been verified successfully.`);
    return response;
  },
};
