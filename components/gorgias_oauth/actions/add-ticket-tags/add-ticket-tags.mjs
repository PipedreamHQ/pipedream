import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-add-ticket-tags",
  name: "Add Ticket Tags",
  description: "Add tags to a ticket. [See the documentation](https://developers.gorgias.com/reference/create-ticket-tags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
      description: "The IDs of the tags to add to the ticket",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.gorgias.addTicketTags({
      $,
      ticketId: this.ticketId,
      data: {
        ids: this.tagIds,
      },
    });
    $.export("$summary", `Successfully added ${this.tagIds.length} tag${this.tagIds.length === 1
      ? ""
      : "s"} to ticket ${this.ticketId}`);
    return response;
  },
};
