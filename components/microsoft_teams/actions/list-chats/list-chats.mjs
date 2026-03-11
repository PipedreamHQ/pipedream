import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-chats",
  name: "List Chats",
  description: "Lists all chat conversations for the authenticated user. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-list)",
  type: "action",
  version: "0.0.1",
  props: {
    microsoftTeams,
  },
  async run({ $ }) {
    const chats = [];
    const response = await this.microsoftTeams.listChats();

    if (response?.value) {
      chats.push(...response.value);
    }

    $.export("$summary", `Successfully fetched ${chats.length} ${chats.length === 1
      ? "chat"
      : "chats"}`);

    return chats;
  },
};
