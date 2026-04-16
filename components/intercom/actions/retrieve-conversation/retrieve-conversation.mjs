import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-retrieve-conversation",
  name: "Retrieve A Conversation",
  description: "Retrieve a conversation by its ID. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/retrieveconversation).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intercom,
    conversationId: {
      propDefinition: [
        intercom,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.intercom.getConversation({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Successfully retrieved conversation with ID: ${this.conversationId}`);
    return response;
  },
};
