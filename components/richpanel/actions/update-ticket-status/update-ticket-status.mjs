import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-update-ticket-status",
  name: "Update Ticket Status",
  description: "Updates the status of an existing ticket in Richpanel. [See the documentation](https://developer.richpanel.com/reference/update-a-conversation).",
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
    status: {
      propDefinition: [
        richpanel,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.richpanel.updateTicket({
      $,
      conversationId: this.conversationId,
      data: {
        ticket: {
          status: this.status,
        },
      },
    });
    $.export("$summary", `Updated ticket ${this.conversationId} to status ${this.status}`);
    return response;
  },
};
