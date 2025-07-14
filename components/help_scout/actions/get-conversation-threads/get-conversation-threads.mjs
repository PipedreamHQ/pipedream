import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-get-conversation-threads",
  name: "Get Conversation Threads",
  description: "Retrieves the threads of a specific conversation. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list/)",
  version: "0.0.1",
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = (await this.helpScout.getConversationThreads({
      $,
      conversationId: this.conversationId,
    }))?._embedded?.threads;

    $.export("$summary", `Successfully retrieved ${response?.length || 0} threads for conversation ID: ${this.conversationId}`);
    return response;
  },
};
