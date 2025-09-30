import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendaudio) for more information",
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
      description: "Enter the audio caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    audio: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Audio",
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
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
      ],
      description: "Enter duration of sent audio in seconds.",
    },
    performer: {
      propDefinition: [
        telegramBotApi,
        "performer",
      ],
    },
    title: {
      propDefinition: [
        telegramBotApi,
        "title",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.audio,
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.sendAudio(this.chatId, this.audio, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      duration: this.duration,
      performer: this.performer,
      title: this.title,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
    $.export("$summary", `Successfully sent the audio file "${resp.audio?.file_name}" to chat, "${this.chatId}""`);
    return resp;
  },
};
