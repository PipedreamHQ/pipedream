import app from "../../microsoft_teams_bot.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams_bot-send-message",
  name: "Send Message",
  description: "Send a message in Microsoft Teams. [See the documentation](https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference?view=azure-bot-service-4.0#send-to-conversation).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    baseUrl: {
      propDefinition: [
        app,
        "baseUrl",
      ],
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
    },
    fromId: {
      propDefinition: [
        app,
        "fromId",
      ],
    },
    fromName: {
      propDefinition: [
        app,
        "fromName",
      ],
    },
    toId: {
      propDefinition: [
        app,
        "toId",
      ],
    },
    toName: {
      propDefinition: [
        app,
        "toName",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  methods: {
    sendMessage({
      conversationId, ...args
    } = {}) {
      return this.app.post({
        path: `/conversations/${conversationId}/activities`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendMessage,
      baseUrl,
      conversationId,
      fromId,
      fromName,
      toId,
      toName,
      text,
    } = this;

    const response = await sendMessage({
      $,
      baseUrl,
      conversationId,
      data: {
        type: constants.ACTIVITY_TYPE.MESSAGE,
        from: {
          id: fromId,
          name: fromName,
        },
        conversation: {
          id: conversationId,
        },
        recipient: {
          id: toId,
          name: toName,
        },
        text,
      },
    });

    $.export("$summary", "Successfully sent message.");

    return response;
  },
};
