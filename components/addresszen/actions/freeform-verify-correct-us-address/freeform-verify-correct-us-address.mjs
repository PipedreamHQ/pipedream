import addresszen from "../../addresszen.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "addresszen-freeform-verify-correct-us-address",
  name: "Verify and Correct Freeform US Address",
  description: "Verifies and corrects a freeform US address. The user enters a single address line that includes city, state, and zip code. [See the documentation](https://docs.addresszen.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addresszen,
    addressLine: {
      propDefinition: [
        addresszen,
        "addressLine",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addresszen.verifyAndCorrectFreeformAddress({
      addressLine: this.addressLine,
    });
    $.export("$summary", "Successfully verified and corrected the address");
    return response;
  },
};
