import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-follow-ups",
  name: "Get Follow-Ups",
  description: "Get a list of all the follow-ups generated from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/follow-ups)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    try {
      const { followUps } = await this.symblAIApp.getFollowUps({
        $,
        conversationId: this.conversationId,
      });
      $.export("$summary", `Successfully retrieved ${followUps.length} Follow-up${followUps.length === 1
        ? ""
        : "s"} from the conversation`);
      return followUps;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Follow-ups from the conversation");
    }
  },
};
