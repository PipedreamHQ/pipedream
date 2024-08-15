import addresszen from "../../addresszen.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "addresszen-verify-correct-us-address-city-state",
  name: "Verify and Correct US Address (City, State)",
  description: "Verifies and corrects a US address using the input of a single address line, city, and state. [See the documentation](https://docs.addresszen.com/docs/api)",
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
    city: {
      propDefinition: [
        addresszen,
        "city",
      ],
    },
    state: {
      propDefinition: [
        addresszen,
        "state",
      ],
    },
  },
  async run({ $ }) {
    const {
      addressLine, city, state,
    } = this;
    const response = await this.addresszen.verifyAndCorrectAddressByCityState({
      addressLine,
      city,
      state,
    });
    $.export("$summary", `Successfully verified and corrected address for ${addressLine}, ${city}, ${state}`);
    return response;
  },
};
