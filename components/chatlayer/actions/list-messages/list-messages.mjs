import app from "../../chatlayer.app.mjs";

export default {
  key: "chatlayer-list-messages",
  name: "List Messages",
  description: "Lists the messages of the specified session. [See the documentation](https://api.chatlayer.ai/v1/docs#operation/getAllMessagesInConversation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    botId: {
      propDefinition: [
        app,
        "botId",
      ],
    },
    version: {
      propDefinition: [
        app,
        "version",
      ],
    },
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
        (c) => ({
          botId: c.botId,
          version: c.version,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listMessages({
      $,
      botId: this.botId,
      sessionId: this.sessionId,
      params: {
        version: this.version,
      },
    });
    $.export("$summary", "Successfully sent the request. Retrieved " + response.data.length + " results");
    return response;
  },
};
