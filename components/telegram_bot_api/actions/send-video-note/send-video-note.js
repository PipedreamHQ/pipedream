/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-video-note",
  name: "Send a Video Note",
  description: "As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. [See the docs](https://core.telegram.org/bots/api#sendvideonote) for more information",
  version: "0.0.1",
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
    videoNote: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Video Note",
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.video,
    },
    length: {
      propDefinition: [
        telegramBotApi,
        "length",
      ],
    },
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
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
  async run() {
    return await this.telegramBotApi.sendVideoNote(this.chatId, this.videoNote, {
      length: this.length,
      duration: this.duration,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
