import gorgiasOAuth from "../../gorgias_oauth.app.mjs";

export default {
  name: "Get Ticket Message",
  description: "Get a specific message from a ticket. [See the documentation](https://developers.gorgias.com/reference/get-ticket-message)",
  key: "gorgias_oauth-get-ticket-message",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      async options({ prevContext }) {
        const {
          data: messages,
          meta,
        } = await this.gorgiasOAuth.listTicketMessages({
          ticketId: this.ticketId,
          params: {
            cursor: prevContext.nextCursor,
          },
        });
        return {
          options: messages.map(({
            id: value, subject: label,
          }) => ({
            label,
            value: +value,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
  },
  async run({ $ }) {
    const response = await this.gorgiasOAuth.getTicketMessage({
      $,
      ticketId: this.ticketId,
      messageId: this.messageId,
    });

    $.export("$summary", `Successfully retrieved message ${this.messageId} from ticket ${this.ticketId}`);

    return response;
  },
};
