import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-topics",
  name: "Get Topics",
  description: "Get a list of all the topics generated from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/get-topics)",
  version: "0.0.1",
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Id of the Conversation",
    },
    sentiment:{
      type: "boolean",
      label: "Sentiment",
      description: "Provides you sentiment analysis for each topic of the conversation",
      optional: true,
      default: false,
    },
    parentRefs:{
      type: "boolean",
      label: "Topic Hierarchy",
      description: "Provides you topic hierarchy for each topic of the conversation",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.symblAIApp.getTopics({
        $,
        conversationId: this.conversationId,
        params: `sentiment=${this.sentiment}&parentRefs=${this.parentRefs}`,
      });
      $.export("$summary", "Topics successfully retrieved from the conversation");
      return response;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Topics from the conversation");
    }
  },
};
