import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-restrict-chat-member",
  name: "Restrict a Chat Member",
  description: "Use this method to restrict a user in a supergroup. [See the docs](https://core.telegram.org/bots/api#restrictchatmember) for more information",
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
    userId: {
      propDefinition: [
        telegramBotApi,
        "userId",
      ],
    },
    until_date: {
      propDefinition: [
        telegramBotApi,
        "until_date",
      ],
      description: "Enter the date when the restrictions will be lifted for the user, in [unix time](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1567780450`).",
    },
    can_send_messages: {
      type: "boolean",
      label: "Set if the User Can Send Messages",
      description: "Pass True, if the user can send text messages, contacts, locations and venues.",
      optional: true,
    },
    can_send_media_messages: {
      type: "boolean",
      label: "Set if the User Can Send Media Messages",
      description: "Pass True, if the user can send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages.",
      optional: true,
    },
    can_send_other_messages: {
      type: "boolean",
      label: "Set if the User Can send Other Messages",
      description: "Pass True, if the user can send animations, games, stickers and use inline bots, implies can_send_media_messages.",
      optional: true,
    },
    can_add_web_page_previews: {
      type: "boolean",
      label: "Set if the User Can Add Web Page Previews",
      description: "Pass True, if the user may add web page previews to their messages, implies can_send_media_messages.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.restrictChatMember(this.chatId, this.userId, {
      until_date: this.until_date,
      can_send_messages: this.can_send_messages,
      can_send_media_messages: this.can_send_media_messages,
      can_send_other_messages: this.can_send_other_messages,
      can_add_web_page_previews: this.can_add_web_page_previews,
    });
    $.export("$summary", `Successfully restricted the user, "${this.userId}", in supergroup, "${this.chatId}"`);
    return resp;
  },
};
