import app from "../../postpulse.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "postpulse-list-chats",
  name: "List Chats",
  description: "List the destinations of a Facebook, Telegram or Pinterest account: its Facebook Pages, Telegram channels and chats, or Pinterest boards. Pass a destination's `id` as **Destination** in **Create Post**. Use **List Accounts** to find account IDs. [See the documentation](https://post-pulse.com/api-docs#accounts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
        () => ({
          platforms: constants.CHAT_PLATFORMS,
        }),
      ],
      description: "A connected Facebook, Telegram or Pinterest account. Use **List Accounts** to see all accounts and their IDs, e.g. `12345`",
    },
  },
  async run({ $ }) {
    const chats = await this.app.listChats({
      $,
      accountId: this.accountId,
    });
    $.export("$summary", `Found ${chats.length} destination${chats.length === 1
      ? ""
      : "s"} for account ${this.accountId}`);
    return chats;
  },
};
