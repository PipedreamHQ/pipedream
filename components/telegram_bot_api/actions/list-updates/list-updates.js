/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-list-updates",
  name: "List Updates",
  description: "Retrieves a list of updates from the Telegram server",
  version: "0.0.1",
  type: "action",
  props: {
    telegram_bot_api,
    offset: {
      propDefinition: [
        telegram_bot_api,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        telegram_bot_api,
        "limit",
      ],
    },
    autoPaging: {
      propDefinition: [
        telegram_bot_api,
        "autoPaging",
      ],
    },
  },
  async run() {
    const updates = await this.telegram_bot_api.getUpdates({
      offset: this.offset,
      limit: this.limit,
    });
    if (this.autoPaging && updates.length > 0) {
      const lastUpdateId = updates[updates.length - 1].update_id;
      // "Confirm" updates by calling API to get updates using an offset of the
      // last `update_id + 1` See [documentation for getUpdates in the Telegram
      // Bot API reference](https://core.telegram.org/bots/api#getupdates)
      await this.telegram_bot_api.getUpdates({
        offset: lastUpdateId + 1,
        limit: 1,
      });
    }
    return updates;
  },
};
