import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-list-administrators-in-chat",
  name: "List Administrators In Chat",
  description: "Use this module to get a list of administrators in a chat. [See the docs](https://core.telegram.org/bots/api#getchatadministrators) for more information",
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
    const resp = await this.telegramBotApi.getChatAdministrators(this.chatId);
    $.export("$summary", `Successfully fetched ${resp.length} administrator${resp.length === 1
      ? ""
      : "s"} in the chat, "${this.chatId}"`);
    return resp;
  },
};
