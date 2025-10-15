import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-kick-chat-member",
  name: "Kick a Chat Member",
  description: "Use this method to kick a user from a group, a supergroup or channel. [See the docs](https://core.telegram.org/bots/api#banchatmember) for more information",
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
      description: "Enter the date when the user will be unbanned, in [unix time](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1567780450`).",
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.banChatMember(this.chatId, this.userId, {
      until_date: this.until_date,
    });
    $.export("$summary", `Successfully kicked user, "${this.userId}", from the chat, "${this.chatId}"`);
    return resp;
  },
};
