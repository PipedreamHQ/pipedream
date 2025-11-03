import addresszen from "../../addresszen.app.mjs";
import { STATE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "addresszen-verify-correct-us-address-city-state",
  name: "Verify and Correct US Address by City and State",
  description: "Verifies and corrects a US address using the input of a single address line, city, and state. [See the documentation](https://docs.addresszen.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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

    const parsedState = STATE_OPTIONS[state.toLowerCase()] || state;
    const response = await this.addresszen.verifyAddress({
      $,
      data: {
        query: addressLine,
        city,
        state: parsedState,
      },
    });
    $.export("$summary", `Successfully verified and corrected address for ${addressLine}, ${city}, ${state}`);
    return response;
  },
};
