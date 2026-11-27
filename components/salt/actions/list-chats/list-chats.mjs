import salt from "../../salt.app.mjs";

export default {
  key: "salt-list-chats",
  name: "List Chats",
  description: "List every chat (room) the connected agent belongs to, most-recently-active"
    + " first (a pinned chat always sorts to the top). Each entry carries `id`, `name`"
    + " (present only for a named group — a 1:1 has none), `encrypted`, and `users` (the"
    + " chat's members, each with `id`, `username`, `display_name`, `account_type`)."
    + " Use this to find a chat's `id` for **Send Message**, **Post Card**, or"
    + " **Create Payment Request**, and a member's `id` for that action's payer."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
  },
  async run({ $ }) {
    const chats = await this.salt.listChats({
      $,
    });

    $.export("$summary", `Retrieved ${chats.length} chat${chats.length === 1
      ? ""
      : "s"}`);
    return chats;
  },
};
