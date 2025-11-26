import freshchat from "../../freshchat.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshchat-update-conversation-status",
  name: "Update Conversation Status",
  description: "Updates the status of a specific conversation. [See the documentation](https://developers.freshchat.com/api/#update_a_conversation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshchat,
    userId: {
      propDefinition: [
        freshchat,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        freshchat,
        "conversationId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      options: [
        "new",
        "assigned",
        "resolved",
        "reopened",
      ],
    },
    agentId: {
      propDefinition: [
        freshchat,
        "agentId",
      ],
      description: "The ID of an agent to assign the conversation to. Required if status is `assigned`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.status === "assigned" && !this.agentId) {
      throw new ConfigurationError("Agent ID is required when status is `assigned`");
    }

    const response = await this.freshchat.updateConversation({
      $,
      conversationId: this.conversationId,
      data: {
        status: this.status,
        assigned_agent_id: this.agentId,
      },
    });
    $.export("$summary", `Updated conversation status to ${this.status}`);
    return response;
  },
};
