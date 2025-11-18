import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-add-ticket-tags",
  name: "Add Ticket Tags",
  description: "Add tags to a ticket (appends to existing tags). [See the documentation](https://developers.freshdesk.com/api/#update_ticket)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    ticketTags: {
      propDefinition: [
        freshdesk,
        "ticketTags",
      ],
      description: "Array of tags to add to the ticket. These will be added to any existing tags.",
    },
  },
  async run({ $ }) {
    const {
      ticketId,
      ticketTags,
    } = this;

    if (!ticketTags || ticketTags.length === 0) {
      throw new ConfigurationError("At least one tag must be provided");
    }

    const response = await this.freshdesk.addTicketTags({
      ticketId,
      tags: ticketTags,
      $,
    });

    $.export("$summary", `Successfully added ${ticketTags.length} tag(s) to ticket ${ticketId}`);
    return response;
  },
};
