import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-analytics",
  name: "Get Analytics",
  description: "Get a list of metrics and member analytics (speaker ratio, talk time, silence, pace and overlap) from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/analytics/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const {
      metrics,
      members,
    } = await this.symblAIApp.getAnalytics({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved ${metrics.length} metrics and ${members.length} member${members.length === 1
      ? ""
      : "s'"} Analytics from the conversation`);
    return {
      metrics,
      members,
    };
  },
};
