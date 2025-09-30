import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-add-ticket-message",
  name: "Add Ticket Message",
  description: "Adds a message to an existing ticket. [See the documentation](https://developer.richpanel.com/reference/update-a-conversation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    richpanel,
    conversationId: {
      propDefinition: [
        richpanel,
        "conversationId",
      ],
    },
    commentBody: {
      propDefinition: [
        richpanel,
        "commentBody",
      ],
    },
    commentSenderType: {
      propDefinition: [
        richpanel,
        "commentSenderType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.richpanel.updateTicket({
      $,
      conversationId: this.conversationId,
      data: {
        ticket: {
          comment: {
            body: this.commentBody,
            sender_type: this.commentSenderType,
          },
        },
      },
    });
    $.export("$summary", `Added message to ticket ${this.conversationId} successfully`);
    return response;
  },
};
