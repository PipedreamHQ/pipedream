import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-set-ticket-tags",
  name: "Set Ticket Tags",
  description: "Set tags on a ticket. [See the documentation](https://developers.gorgias.com/reference/update-ticket-tags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gorgias,
    ticketId: {
      propDefinition: [
        gorgias,
        "ticketId",
      ],
    },
    tagIds: {
      propDefinition: [
        gorgias,
        "tagId",
      ],
      type: "string[]",
      label: "Tag IDs",
      description: "The IDs of the tags to set on the ticket",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.gorgias.setTicketTags({
      $,
      ticketId: this.ticketId,
      data: {
        ids: this.tagIds,
      },
    });
    $.export("$summary", `Successfully set ${this.tagIds.length} tag${this.tagIds.length === 1
      ? ""
      : "s"} on ticket ${this.ticketId}`);
    return response;
  },
};
