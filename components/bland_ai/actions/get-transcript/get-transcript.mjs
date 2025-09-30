import blandAi from "../../bland_ai.app.mjs";

export default {
  key: "bland_ai-get-transcript",
  name: "Get Transcript",
  description: "Retrieves the transcript of a specified call post-completion. [See the documentation](https://docs.bland.ai/api-v1/get/calls-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.blandAi.getTranscript({
      $,
      callId: this.callId,
    });
    $.export("$summary", `Successfully retrieved transcript for call ID: ${this.callId}`);
    return response;
  },
};
