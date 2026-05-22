import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-update-ticket-summary",
  name: "Update Ticket Summary",
  description: "Create or update the summary note for a ticket. [See the documentation](https://developers.freshdesk.com/api/#ticket_summary)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Content of the summary note in HTML",
    },
    user_id: {
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
      user_id: userId,
    } = this;

    if (!body?.trim()) {
      throw new ConfigurationError("Summary body cannot be empty");
    }

    const data = {
      body,
    };

    if (userId) {
      const parsedUserId = Number(userId);
      if (Number.isNaN(parsedUserId)) {
        throw new ConfigurationError("User ID must be a valid number");
      }
      data.user_id = parsedUserId;
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
