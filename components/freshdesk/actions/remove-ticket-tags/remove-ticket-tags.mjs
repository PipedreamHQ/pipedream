import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-remove-ticket-tags",
  name: "Remove Ticket Tags",
  description: "Remove specific tags from a ticket. [See the documentation](https://developers.freshdesk.com/api/#update_ticket)",
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
      description: "Array of tags to remove from the ticket. Only these specific tags will be removed.",
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

    const response = await this.freshdesk.removeTicketTags({
      ticketId,
      tags: ticketTags,
      $,
    });

    $.export("$summary", `Successfully removed ${ticketTags.length} tag(s) from ticket ${ticketId}`);
    return response;
  },
};
