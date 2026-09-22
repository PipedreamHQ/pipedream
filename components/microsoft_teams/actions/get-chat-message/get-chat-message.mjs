import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-get-chat-message",
  name: "Get Chat Message",
  description: "Get a specific message from a chat. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chatmessage-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
    chatId: {
      propDefinition: [
        microsoftTeams,
        "chat",
      ],
    },
    messageId: {
      propDefinition: [
        microsoftTeams,
        "messageId",
        (c) => ({
          chatId: c.chatId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTeams.getChatMessage({
      chatId: this.chatId,
      messageId: this.messageId,
    });
    $.export("$summary", `Successfully fetched message "${response.body.content}"`);
    return response;
  },
};
