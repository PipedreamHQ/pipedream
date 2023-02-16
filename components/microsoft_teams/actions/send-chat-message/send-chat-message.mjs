import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-send-chat-message",
  name: "Send Chat Message",
  description: "Send a message to a team&#39;s chat. [See the docs here](https://docs.microsoft.com/en-us/graph/api/chat-post-messages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.3",
  props: {
    microsoftTeams,
    chatId: {
      propDefinition: [
        microsoftTeams,
        "chat",
      ],
    },
    message: {
      propDefinition: [
        microsoftTeams,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const {
      chatId,
      message,
    } = this;

    const response =
      await this.microsoftTeams.sendChatMessage({
        chatId,
        content: {
          body: {
            content: message,
          },
        },
      });

    $.export("$summary", `Successfully sent message to chat ${chatId}`);

    return response;
  },
};
