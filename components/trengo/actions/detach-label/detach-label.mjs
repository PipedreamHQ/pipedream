import app from "../../trengo.app.mjs";

export default {
  key: "trengo-detach-label",
  name: "Detach Label",
  description: "Detach a label from a ticket. [See the documentation](https://developers.trengo.com/reference/detach-a-label)",
  version: "0.0.1",
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
    const response = await this.app.detachLabel({
      $,
      ticketId: this.ticketId,
      labelId: this.labelId,
    });
    $.export("$summary", `Successfully detached label with ID ${this.labelId} from ticket with ID ${this.ticketId}`);
    return response;
  },
};
