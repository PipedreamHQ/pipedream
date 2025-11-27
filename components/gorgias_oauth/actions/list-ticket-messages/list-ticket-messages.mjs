import gorgiasOAuth from "../../gorgias_oauth.app.mjs";

export default {
  name: "List Ticket Messages",
  description: "List all messages for a specific ticket. [See the documentation](https://developers.gorgias.com/reference/list-ticket-messages)",
  key: "gorgias_oauth-list-ticket-messages",
  version: "0.0.1",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return (1-100)",
      min: 1,
      max: 100,
      default: 50,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Cursor for pagination (get from the meta.next_cursor of the previous response)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
    };

    if (this.cursor) {
      params.cursor = this.cursor;
    }

    const response = await this.gorgiasOAuth.listTicketMessages({
      $,
      ticketId: this.ticketId,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} message${response.data.length === 1
      ? ""
      : "s"}`);

    // Return the data and pagination info
    return {
      data: response.data,
      meta: response.meta,
    };
  },
};
