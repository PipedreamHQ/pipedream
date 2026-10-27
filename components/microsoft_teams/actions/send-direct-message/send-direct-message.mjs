import { ConfigurationError } from "@pipedream/platform";
import microsoftTeams from "../../microsoft_teams.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams-send-direct-message",
  name: "Send Direct Message",
  description: "Send a one-on-one message to a user, even if you have never chatted with them before. Reuses the existing one-on-one chat when there is one, otherwise creates it. To post to an existing group chat, use **Send Chat Message** instead. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-post?view=graph-rest-1.0&tabs=http#example-5-create-a-one-on-one-chat-using-user-principal-name)",
  type: "action",
  version: "0.0.1",
  ai: "optimized",
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
      description: "The recipient's user principal name (usually their work email, e.g. `alex@contoso.com`) or Microsoft Entra user ID (e.g. `82af01c5-f7cc-4a2e-a728-3a5df21afd9d`, the **Object ID** under **Users** in the Microsoft Entra admin center)",
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
    isGuest: {
      type: "boolean",
      label: "Recipient Is Guest",
      description: "Set to `true` when the recipient is a guest user in your organization, which Microsoft Graph requires to join with the `guest` role. Leave `false` for members of your organization and for users in other organizations.",
      optional: true,
      default: false,
    },
  },
  methods: {
    buildMember(user, role) {
      return {
        "@odata.type": constants.AAD_USER_MEMBER_TYPE,
        "roles": [
          role,
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
      isGuest,
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
          this.buildMember(currentUserId, constants.MEMBER_ROLE_OWNER),
          this.buildMember(recipient, isGuest
            ? constants.MEMBER_ROLE_GUEST
            : constants.MEMBER_ROLE_OWNER),
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
