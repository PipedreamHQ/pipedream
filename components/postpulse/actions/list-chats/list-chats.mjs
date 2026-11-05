import app from "../../postpulse.app.mjs";

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
      ],
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
