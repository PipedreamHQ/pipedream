import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text or game messages. [See the docs](https://core.telegram.org/bots/api#editmessagetext) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telegramBotApi,
    chatId: {
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegramBotApi,
        "messageId",
      ],
    },
    text: {
      propDefinition: [
        telegramBotApi,
        "text",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.editMessageText(this.text, {
      chatId: this.chatId,
      messageId: this.messageId,
      disable_notification: this.disable_notification,
    });
    $.export("$summary", `Successfully edited the message in chat, "${this.chatId}"`);
    return resp;
  },
};
