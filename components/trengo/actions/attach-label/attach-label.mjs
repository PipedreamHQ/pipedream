import app from "../../trengo.app.mjs";

export default {
  key: "trengo-attach-label",
  name: "Attach Label",
  description: "Attach a label to a ticket. [See the documentation](https://developers.trengo.com/reference/apply-a-label)",
  version: "0.0.6",
  type: "action",
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
    labelId: {
      propDefinition: [
        app,
        "labelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.attachLabel({
      $,
      ticketId: this.ticketId,
      data: {
        label_id: this.labelId,
      },
    });
    $.export("$summary", `Successfully attached label with ID ${this.labelId} to ticket with ID ${this.ticketId}`);
    return response;
  },
};
