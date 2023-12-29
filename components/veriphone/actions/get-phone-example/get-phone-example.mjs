import veriphone from "../../veriphone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "veriphone-get-phone-example",
  name: "Get Dummy Phone Number",
  description: "Returns a dummy phone number for a specific country and phone type. [See the documentation](https://veriphone.io/docs/v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    veriphone,
    country: {
      propDefinition: [
        veriphone,
        "country",
      ],
    },
    phoneType: {
      propDefinition: [
        veriphone,
        "phoneType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.veriphone.getDummyPhoneNumber({
      country: this.country,
      phoneType: this.phoneType,
    });

    $.export("$summary", `Retrieved dummy phone number for country ${this.country} and type ${this.phoneType}`);
    return response;
  },
};
