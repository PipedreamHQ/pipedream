import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-summary",
  name: "Get Summary",
  description: "Get a summary of important contextual messages in a conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/summary)",
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
    refresh: {
      type: "boolean",
      label: "Refresh",
      description: "Allows you to regenerate the Summary (Async APIs), create summary (Telephony and Streaming APIs) and generate the Summary for already processed conversations.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    try {
      const { summary } = await this.symblAIApp.getSummary({
        $,
        conversationId: this.conversationId,
        params: {
          refresh: this.refresh,
        },
      });
      $.export("$summary", `Successfully generated ${summary.length} Summary message${summary.length === 1
        ? ""
        : "s"} from the conversation`);
      return summary;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to generate the Summary of the conversation");
    }
  },
};
