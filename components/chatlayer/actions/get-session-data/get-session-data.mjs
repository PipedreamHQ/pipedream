import app from "../../chatlayer.app.mjs";

export default {
  key: "chatlayer-get-session-data",
  name: "Get Session Data",
  description: "Gets data for the specified session. [See the documentation](https://api.chatlayer.ai/v1/docs#operation/getConversationSessionData)",
  version: "0.0.1",
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
    const response = await this.app.getSessionData({
      $,
      botId: this.botId,
      sessionId: this.sessionId,
      params: {
        version: this.version,
      },
    });
    $.export("$summary", "Successfully sent the request");
    return response;
  },
};
