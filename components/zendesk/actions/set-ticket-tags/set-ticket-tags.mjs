import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-set-ticket-tags",
  name: "Set Ticket Tags",
  description: "Set tags on a ticket (replaces all existing tags). [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/tags/#set-tags).",
  type: "action",
  version: "0.0.4",
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

    const response = await this.app.setTicketTags({
      step,
      ticketId,
      tags: ticketTags,
      customSubdomain,
    });

    step.export("$summary", `Successfully set ${ticketTags.length} tag(s) on ticket ${ticketId}`);
    return response;
  },
};
