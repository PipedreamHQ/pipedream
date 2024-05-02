import fractel from "../../fractel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fractel-call-phone",
  name: "Call Phone",
  description: "Initiates a new phone call to the provided number.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fractel,
    phoneNumber: {
      propDefinition: [
        fractel,
        "phoneNumber",
      ],
    },
    to: {
      propDefinition: [
        fractel,
        "to",
      ],
    },
    message: {
      propDefinition: [
        fractel,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fractel.initiateCall({
      phoneNumber: this.phoneNumber,
      to: this.to,
      message: this.message,
    });

    $.export("$summary", `Successfully initiated a call to ${this.to}`);
    return response;
  },
};
