import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-get-num-members-in-chat",
  name: "Get the Number of Members in a Chat",
  description: "Use this module to get the number of members in a chat. [See the docs](https://core.telegram.org/bots/api#getchatmembercount) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.getChatMemberCount(this.chatId);
    $.export("$summary", `Successfully fetched the number of members in chat, "${this.chatId}"`);
    return resp;
  },
};
