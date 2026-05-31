import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-update-ticket-summary",
  name: "Update Ticket Summary",
  description: "Create or update the summary note for a ticket. [See the documentation](https://developers.freshdesk.com/api/#ticket_summary)",
  version: "0.0.1",
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Summary Body",
      description: "Content of the summary note in HTML, e.g., \"<p>Ticket resolved after updating settings.</p>\"",
      optional: false,
    },
    userId: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
      label: "User ID",
      description: "ID of the user who creates or updates the summary note",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshdesk,
      ticketId,
      body,
      userId,
    } = this;

    if (!body?.trim()) {
      throw new ConfigurationError("Summary body cannot be empty");
    }

    const data = {
      body,
    };

    if (userId) {
      data.user_id = userId;
    }

    const response = await freshdesk.updateTicketSummary({
      $,
      ticketId,
      data,
    });

    $.export("$summary", `Successfully updated summary for ticket ${ticketId}`);
    return response;
  },
};
