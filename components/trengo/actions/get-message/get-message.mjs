import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-message",
  name: "Get Message",
  description: "Get a message by ID. [See the documentation](https://developers.trengo.com/reference/fetch-a-message)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    messageId: {
      propDefinition: [
        app,
        "messageId",
        (c) => ({
          ticketId: c.ticketId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMessage({
      $,
      ticketId: this.ticketId,
      messageId: this.messageId,
    });
    $.export("$summary", `Successfully retrieved message with ID ${this.messageId}`);
    return response;
  },
};
