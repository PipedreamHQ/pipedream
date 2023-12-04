import convolo_ai from "../../convolo_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "convolo_ai-create-call",
  name: "Create Call",
  description: "Initiates a phone call to a lead and establishes the connection with the first available agent. [See the documentation](https://help.convolo.ai/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    convolo_ai,
    agentIdentifier: {
      propDefinition: [
        convolo_ai,
        "agentIdentifier",
      ],
    },
    leadPhoneNumber: {
      propDefinition: [
        convolo_ai,
        "leadPhoneNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.convolo_ai.initiatePhoneCall({
      agentIdentifier: this.agentIdentifier,
      leadPhoneNumber: this.leadPhoneNumber,
    });

    $.export("$summary", `Successfully initiated a call to lead with phone number ${this.leadPhoneNumber}`);
    return response;
  },
};
