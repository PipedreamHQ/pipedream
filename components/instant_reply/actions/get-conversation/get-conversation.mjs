import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-get-conversation",
  name: "Get Conversation",
  description: "Retrieve a single conversation by ID, including its current status, assignee, and last message. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    conversationId: {
      propDefinition: [
        instantReply,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.instantReply._makeRequest({
      $,
      method: "GET",
      path: `/conversations/${this.conversationId}`,
    });
    $.export("$summary", `Fetched conversation ${this.conversationId} (status: ${response?.status})`);
    return response;
  },
};
