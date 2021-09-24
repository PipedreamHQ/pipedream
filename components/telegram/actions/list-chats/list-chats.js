const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-chats",
  name: "List Chats",
  description: "List available Telegram chats",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    offset: {
      propDefinition: [
        telegram,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        telegram,
        "limit",
      ],
    },
    autoPaging: {
      propDefinition: [
        telegram,
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
  async run() {
    const updates = await this.telegram.getUpdates({
      offset: this.offset,
      limit: this.limit,
    });
    if (this.autoPaging && updates.length > 0) {
      const lastUpdateId = updates[updates.length - 1].update_id;
      // "Confirm" updates by calling API to get updates using an offset of the
      // last `update_id + 1` See [documentation for getUpdates in the Telegram
      // Bot API reference](https://core.telegram.org/bots/api#getupdates)
      await this.telegram.getUpdates({
        offset: lastUpdateId + 1,
        limit: 1,
      });
    }
    return updates.map(this.generateResultFromUpdate);
  },
};
