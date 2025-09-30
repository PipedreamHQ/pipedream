import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-delete-message",
  name: "Delete a Message",
  description: "Deletes a message. [See the docs](https://core.telegram.org/bots/api#deletemessage) for more information",
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
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.deleteMessage(this.chatId, this.messageId);
    $.export("$summary", `Successfully deleted the message from chat, "${this.chatId}"`);
    return resp;
  },
};
