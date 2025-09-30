import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-send-sticker",
  name: "Send a Sticker",
  description: "Sends a .webp sticker to you Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendsticker) for more information",
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
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    sticker: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Sticker",
    },
    reply_to_message_id: {
      propDefinition: [
        telegramBotApi,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.sendSticker(this.chatId, this.sticker, {
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent the sticker${this.fileName ? ` "${this.filename}"` : ""} to chat, "${this.chatId}"`);
    return resp;
  },
};
