import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-claim-conversation",
  name: "Claim Conversation",
  description: "Claims a conversation for a given agent. To avoid taking over assigned conversations, set the force paremeter to false. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/putConversationsConversationidClaim)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dixa,
    endUserId: {
      propDefinition: [
        dixa,
        "endUserId",
      ],
    },
    conversationId: {
      propDefinition: [
        dixa,
        "conversationId",
        ({ endUserId }) => ({
          endUserId,
        }),
      ],
    },
    agentId: {
      propDefinition: [
        dixa,
        "agentId",
      ],
      hidden: false,
      description: "The ID of the agent who is claiming the conversation.",
    },
    force: {
      type: "boolean",
      label: "Force",
      description: "Set as false to avoid taking over the conversation if it is already assigned to an agent.",
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.dixa.claimConversation({
      $,
      conversationId: this.conversationId,
      data: {
        agentId: this.agentId,
        force: this.force,
      },
    });
    $.export("$summary", `Successfully claimed conversation ${this.conversationId} for agent ${this.agentId}`);
    return response;
  },
};
