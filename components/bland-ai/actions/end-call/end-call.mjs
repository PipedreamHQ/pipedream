import blandAi from "../../bland-ai.app.mjs";

export default {
  key: "bland-ai-end-call",
  name: "End Call",
  description: "Terminates a currently ongoing call using Bland AI. [See the documentation](https://docs.bland.ai/api-v1/post/calls-id-stop)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blandAi,
    uniqueCallIdentity: {
      propDefinition: [
        blandAi,
        "uniqueCallIdentity",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blandAi.terminateCall(this.uniqueCallIdentity);
    $.export("$summary", `Successfully ended call with ID: ${this.uniqueCallIdentity}`);
    return response;
  },
};
