import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-trackers",
  name: "Get Trackers",
  description: "Get a list of the detected trackers in the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/trackers/).",
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
    const trackers  =
      await this.symblAIApp.getTrackers({
        $,
        conversationId: this.conversationId,
      });
    $.export("$summary", `Successfully retrieved ${trackers.length} Tracker${trackers.length === 1
      ? ""
      : "s"} from the conversation`);
    return trackers;
  },
};
