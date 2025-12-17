import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-get-conversation-details",
  name: "Get Conversation Details",
  description: "Retrieves the details of a specific conversation. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/get/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    embed: {
      type: "boolean",
      label: "Embed",
      description: "If true, the response will include the threads of the conversation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.getConversation({
      $,
      conversationId: this.conversationId,
      params: {
        embed: this.embed
          ? "threads"
          : undefined,
      },
    });

    $.export("$summary", `Successfully retrieved conversation details (ID: ${this.conversationId})`);
    return response;
  },
};
