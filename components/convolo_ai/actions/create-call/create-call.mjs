import convoloAi from "../../convolo_ai.app.mjs";

export default {
  key: "convolo_ai-create-call",
  name: "Create Call",
  description: "Initiates a phone call to a lead and establishes the connection with the first available agent. [See the documentation](https://help.convolo.ai/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    convoloAi,
    lcNumber: {
      type: "string",
      label: "LC Number",
      description: "The phone number to create the call.",
    },
  },
  async run({ $ }) {
    const response = await this.convoloAi.createCall({
      $,
      data: {
        lc_number: this.lcNumber,
      },
    });

    $.export("$summary", `Successfully created a call with ID: ${response.callId}`);
    return response;
  },
};
