import app from "../../microsoft_teams_bot.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams_bot-reply-to-message",
  name: "Reply To Message",
  description: "Reply to a message in Microsoft Teams. [See the documentation](https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-quickstart?view=azure-bot-service-4.0#reply-to-the-users-message).",
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
    activityId: {
      type: "string",
      label: "Reply To ID",
      description: "ID of the message being replied to. Required for threading messages correctly in Teams conversations. Maps to `event.body.id` from the trigger event.",
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
    replyToMessage({
      conversationId, activityId, ...args
    } = {}) {
      return this.app.post({
        path: `/conversations/${conversationId}/activities/${activityId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      replyToMessage,
      baseUrl,
      text,
      fromId,
      fromName,
      conversationId,
      toId,
      toName,
      activityId,
    } = this;

    const response = await replyToMessage({
      $,
      baseUrl,
      conversationId,
      activityId,
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
        replyToId: activityId,
      },
    });

    $.export("$summary", "Successfully replied to message.");

    return response;
  },
};
