import { parseObject } from "../../common/utils.mjs";
import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-update-conversation",
  name: "Update Conversation",
  description: "Update a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Conversations/operation/UpdateConversation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sunshineConversations,
    userId: {
      propDefinition: [
        sunshineConversations,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        sunshineConversations,
        "conversationId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "A friendly name for the conversation, may be displayed to the business or the user",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short text describing the conversation",
      optional: true,
    },
    iconUrl: {
      type: "string",
      label: "Icon URL",
      description: "A custom conversation icon url. The image must be in either JPG, PNG, or GIF format",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Flat object containing custom properties. Strings, numbers and booleans are the only supported format that can be passed to metadata. The metadata is limited to 4KB in size",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sunshineConversations.updateConversation({
      $,
      conversationId: this.conversationId,
      data: {
        displayName: this.displayName,
        description: this.description,
        iconUrl: this.iconUrl,
        metadata: parseObject(this.metadata),
      },
    });

    $.export("$summary", `Successfully updated conversation with ID ${this.conversationId}`);
    return response;
  },
};
