import app from "../../chatlayer.app.mjs";

export default {
  key: "chatlayer-get-conversations",
  name: "Get Conversations",
  description: "Lists conversations with the specified bot. [See the documentation](https://api.chatlayer.ai/v1/docs#operation/getAllPaginatedConversationsByBotId)",
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
  },
  async run({ $ }) {
    const response = await this.app.getConversations({
      $,
      botId: this.botId,
      params: {
        version: this.version,
      },
    });
    $.export("$summary", "Successfully sent the request. Retrieved " + response.data.length + " results");
    return response;
  },
};
