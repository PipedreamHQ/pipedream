import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-set-ticket-tags",
  name: "Set Ticket Tags",
  description: "Set tags on a ticket (replaces all existing tags). [See the documentation](https://developers.freshdesk.com/api/#update_ticket)",
  type: "action",
  version: "0.0.6",
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
      description: "Array of tags to set on the ticket. This will replace all existing tags.",
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

    const response = await this.freshdesk.setTicketTags({
      ticketId,
      tags: ticketTags,
      $,
    });

    $.export("$summary", `Successfully set ${ticketTags.length} tag(s) on ticket ${ticketId}`);
    return response;
  },
};
