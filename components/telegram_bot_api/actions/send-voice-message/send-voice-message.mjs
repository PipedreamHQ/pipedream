import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-voice-message",
  name: "Send a Voice Message",
  description: "Sends a voice message. [See the docs](https://core.telegram.org/bots/api#sendvoice) for more information",
  version: "0.0.7",
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
    caption: {
      propDefinition: [
        telegramBotApi,
        "caption",
      ],
      description: "Enter the voice message caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    voice: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Voice Message",
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
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.voice,
    },
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
      ],
      description: "Enter the duration of sent voice message in seconds.",
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.sendAudio(this.chatId, this.voice, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      duration: this.duration,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent the voice message${this.fileName ? ` "${this.filename}"` : ""} to chat, "${this.chatId}"`);
    return resp;
  },
};
