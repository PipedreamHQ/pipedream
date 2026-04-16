import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-messages-in-chat",
  name: "List Messages in Chat",
  description: "Get the list of messages in a chat. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-list-messages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.1",
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
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const messages = [];
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listChatMessages, {
      chatId: this.chatId,
    });

    for await (const message of paginator) {
      messages.push(message);
      if (this.maxResults && messages.length >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully fetched ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return messages;
  },
};
