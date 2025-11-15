import { defineAction } from "@pipedream/types";
import gorgiasOAuth from "../../gorgias_oauth.app.mjs";

export default defineAction({
  name: "Get Ticket Message",
  description: "Get a specific message from a ticket [See docs here](https://developers.gorgias.com/reference/get-ticket-message)",
  key: "gorgias_oauth-get-ticket-message",
  version: "0.0.1",
  type: "action",
  props: {
    gorgiasOAuth,
    ticketId: {
      propDefinition: [
        gorgiasOAuth,
        "ticketId",
      ],
    },
    messageId: {
      type: "integer",
      label: "Message ID",
      description: "The ID of the message to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.gorgiasOAuth.getTicketMessage({
      $,
      ticketId: this.ticketId,
      messageId: this.messageId,
    });

    // Add summary for user feedback
    $.export("$summary", `Successfully retrieved message ${this.messageId} from ticket ${this.ticketId}`);

    return response;
  },
});
