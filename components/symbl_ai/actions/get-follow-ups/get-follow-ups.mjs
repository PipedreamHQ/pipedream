import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-follow-ups",
  name: "Get Follow-Ups",
  description: "Get a list of all the follow-ups generated from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/follow-ups)",
  version: "0.0.1",
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Id of the Conversation",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.symblAIApp.getFollowUps({
        $,
        conversationId: this.conversationId,
      });
      $.export("$summary", "Follow-ups successfully retrieved from the conversation");
      return response;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Follow-ups from the conversation");
    }
  },
};
