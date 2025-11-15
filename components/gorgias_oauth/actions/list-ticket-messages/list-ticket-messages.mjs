import { defineAction } from "@pipedream/types";
import gorgiasOAuth from "../../gorgias_oauth.app.mjs";

export default defineAction({
  name: "List Ticket Messages",
  description: "List all messages for a specific ticket [See docs here](https://developers.gorgias.com/reference/list-ticket-messages)",
  key: "gorgias_oauth-list-ticket-messages",
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

    // Add summary for user feedback
    $.export("$summary", `Successfully retrieved ${response.data.length} message${response.data.length === 1 ? '' : 's'}`);

    // Return the data and pagination info
    return {
      data: response.data,
      meta: response.meta,
    };
  },
});
