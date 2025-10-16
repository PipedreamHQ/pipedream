import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-list-chats",
  name: "List Chats",
  description: "List available Telegram chats. [See the docs](https://core.telegram.org/bots/api#getupdates) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    telegramBotApi,
    offset: {
      propDefinition: [
        telegramBotApi,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        telegramBotApi,
        "limit",
      ],
    },
    autoPaging: {
      propDefinition: [
        telegramBotApi,
        "autoPaging",
      ],
    },
  },
  methods: {
    /**
     * Uses an Update object to generate a result object containing chat
     * metadata, representing the source of the update and chat in which the
     * update was made
     *
     * @param {Object} update - an Update to use to generate a result
     * @returns a result representing a chat
     */
    generateResultFromUpdate(update) {
      return {
        update_id: update.update_id,
        ...Object.keys(update).reduce((resultPart, key) => {
          return (resultPart.chat
            ? resultPart
            : {
              chat: update[key].chat,
              from: update[key].from,
              forward_from_chat: update[key].forward_from_chat,
            });
        }, {}),
      };
    },
  },
  async run({ $ }) {
    const updates = await this.telegramBotApi.getUpdates({
      offset: this.offset,
      limit: this.limit,
    });
    if (this.autoPaging && updates.length > 0) {
      const lastUpdateId = updates[updates.length - 1].update_id;
      // "Confirm" updates by calling API to get updates using an offset of the
      // last `update_id + 1` See [documentation for getUpdates in the Telegram
      // Bot API reference](https://core.telegram.org/bots/api#getupdates)
      await this.telegramBotApi.getUpdates({
        offset: lastUpdateId + 1,
        limit: 1,
      });
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${updates.length} available Telegram chat${updates.length === 1 ? "" : "s"}`);
    return updates.map(this.generateResultFromUpdate);
  },
};
