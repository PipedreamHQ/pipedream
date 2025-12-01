import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-remove-ticket-tags",
  name: "Remove Ticket Tags",
  description: "Remove specific tags from a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/tags/#remove-tags).",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    ticketTags: {
      propDefinition: [
        app,
        "ticketTags",
      ],
      description: "Array of tags to remove from the ticket.",
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      ticketId,
      ticketTags,
      customSubdomain,
    } = this;

    const response = await this.app.removeTicketTags({
      step,
      ticketId,
      tags: ticketTags,
      customSubdomain,
    });

    step.export("$summary", `Successfully removed ${ticketTags.length} tag(s) from ticket ${ticketId}`);
    return response;
  },
};
