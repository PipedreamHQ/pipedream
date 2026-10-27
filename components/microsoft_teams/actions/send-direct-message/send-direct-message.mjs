import { ConfigurationError } from "@pipedream/platform";
import microsoftTeams from "../../microsoft_teams.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams-send-direct-message",
  name: "Send Direct Message",
  description: "Send a one-on-one message to a user, even if you have never chatted with them before. Reuses the existing one-on-one chat when there is one, otherwise creates it. To post to an existing group chat, use **Send Chat Message** instead. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-post?view=graph-rest-1.0&tabs=http#example-5-create-a-one-on-one-chat-using-user-principal-name)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftTeams,
    user: {
      type: "string",
      label: "User",
      description: "The recipient's user principal name (usually their work email, e.g. `alex@contoso.com`) or Microsoft Entra user ID",
    },
    message: {
      propDefinition: [
        microsoftTeams,
        "message",
      ],
    },
    contentType: {
      propDefinition: [
        microsoftTeams,
        "contentType",
      ],
    },
  },
  methods: {
    buildMember(user) {
      return {
        "@odata.type": constants.AAD_USER_MEMBER_TYPE,
        "roles": [
          constants.MEMBER_ROLE_OWNER,
        ],
        "user@odata.bind": `${constants.GRAPH_USERS_BASE_URL}('${user.replace(/'/g, "''")}')`,
      };
    },
  },
  async run({ $ }) {
    const {
      user,
      message,
      contentType,
    } = this;

    const recipient = user.trim();
    if (!recipient) {
      throw new ConfigurationError("`User` must be a user principal name or user ID");
    }

    const currentUserId = await this.microsoftTeams.authenticatedUserId();

    const chat = await this.microsoftTeams.createChat({
      content: {
        chatType: constants.CHAT_TYPE_ONE_ON_ONE,
        members: [
          this.buildMember(currentUserId),
          this.buildMember(recipient),
        ],
      },
    });

    const response = await this.microsoftTeams.sendChatMessage({
      chatId: chat.id,
      content: {
        body: {
          content: message,
          contentType: contentType ?? "text",
        },
      },
    });

    $.export("$summary", `Successfully sent direct message to ${recipient}`);

    return response;
  },
};
