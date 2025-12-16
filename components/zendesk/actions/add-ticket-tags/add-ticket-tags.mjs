import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-add-ticket-tags",
  name: "Add Ticket Tags",
  description: "Add tags to a ticket (appends to existing tags). [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/tags/#add-tags).",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
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
      description: "Array of tags to add to the ticket. These will be appended to any existing tags.",
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

    const response = await this.app.addTicketTags({
      step,
      ticketId,
      tags: ticketTags,
      customSubdomain,
    });

    step.export("$summary", `Successfully added ${ticketTags.length} tag(s) to ticket ${ticketId}`);
    return response;
  },
};
