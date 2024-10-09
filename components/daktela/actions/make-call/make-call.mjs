import daktela from "../../daktela.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "daktela-make-call",
  name: "Initiate Phone Call",
  description: "Initiates a phone call via Daktela. [See the documentation](https://customer.daktela.com/apihelp/v6/working-with/call-activities)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    daktela,
    phoneNumber: {
      propDefinition: [
        daktela,
        "phoneNumber",
      ],
    },
    callerNumber: {
      propDefinition: [
        daktela,
        "callerNumber",
      ],
      optional: true,
    },
    callingTime: {
      propDefinition: [
        daktela,
        "callingTime",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      phoneNumber: this.phoneNumber,
      callerNumber: this.callerNumber,
      callingTime: this.callingTime,
    };

    const response = await this.daktela.initiateCall(params);
    $.export("$summary", `Successfully initiated call to ${this.phoneNumber}`);
    return response;
  },
};
