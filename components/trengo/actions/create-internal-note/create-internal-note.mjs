import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-create-internal-note",
  version: "0.0.1",
  name: "Create Internal Note",
  description: "Create an internal note on a ticket that is only visible to team members. [See the docs](https://developers.trengo.com/reference/create-internal-note)",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
      optional: false,
      description: "The internal note content that will be added to the ticket.",
    },
  },
  async run({ $ }) {
    const resp = await this.app.createInternalNote({
      $,
      data: {
        ticket_id: this.ticketId,
        note: this.note,
      },
    });
    $.export("$summary", `Successfully created internal note on ticket ${this.ticketId}`);
    return resp;
  },
};

