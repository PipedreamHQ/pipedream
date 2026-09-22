import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-chats",
  name: "List Chats",
  description: "Lists all chat conversations for the authenticated user. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-list)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
  },
  async run({ $ }) {
    const chats = [];
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listChats);

    for await (const chat of paginator) {
      chats.push(chat);
    }

    $.export("$summary", `Successfully fetched ${chats.length} ${chats.length === 1
      ? "chat"
      : "chats"}`);

    return chats;
  },
};
