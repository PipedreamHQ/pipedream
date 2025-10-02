import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message. [See the docs](https://core.telegram.org/bots/api#unpinchatmessage) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
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
    const resp = await this.telegramBotApi.unpinChatMessage(this.chatId, this.messageId);
    $.export("$summary", `Successfully unpinned the message from chat, "${this.chatId}"`);
    return resp;
  },
};
