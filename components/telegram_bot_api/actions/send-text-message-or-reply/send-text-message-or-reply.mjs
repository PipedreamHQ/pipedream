import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-send-text-message-or-reply",
  name: "Send a Text Message or Reply",
  description: "Sends a text message or a reply to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendmessage) for more information",
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
    text: {
      propDefinition: [
        telegramBotApi,
        "text",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
    link_preview_options: {
      propDefinition: [
        telegramBotApi,
        "link_preview_options",
      ],
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
    const resp = await this.telegramBotApi.sendMessage(this.chatId, this.text, {
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      link_preview_options: this.link_preview_options,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent a ${this.reply_to_message_id ? "reply" : "text message"} to chat, "${this.chatId}"`);
    return resp;
  },
};
