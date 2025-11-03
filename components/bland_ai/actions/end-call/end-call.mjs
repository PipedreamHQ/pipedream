import blandAi from "../../bland_ai.app.mjs";

export default {
  key: "bland_ai-end-call",
  name: "End Call",
  description: "Terminates a currently ongoing call using Bland AI. [See the documentation](https://docs.bland.ai/api-v1/post/calls-id-stop)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blandAi,
    callId: {
      propDefinition: [
        blandAi,
        "callId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blandAi.terminateCall({
      $,
      callId: this.callId,
    });
    $.export("$summary", `Successfully ended call with ID: ${this.callId}`);
    return response;
  },
};
