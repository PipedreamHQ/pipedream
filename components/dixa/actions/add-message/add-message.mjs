import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-add-message",
  name: "Add Message to Conversation",
  description: "Adds a message to an existing conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/postConversationsConversationidMessages).",
  version: "0.0.3",
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
    content: {
      type: "string",
      label: "Content",
      description: "Content of the message",
    },
    direction: {
      propDefinition: [
        dixa,
        "direction",
      ],
      reloadProps: true,
    },
    agentId: {
      propDefinition: [
        dixa,
        "agentId",
      ],
    },
  },
  async additionalProps(props) {
    props.agentId.hidden = this.direction !== "Outbound";
    return {};
  },
  async run({ $ }) {
    const response = await this.dixa.addMessage({
      $,
      conversationId: this.conversationId,
      data: {
        agentId: this.direction === "Outbound"
          ? this.agentId
          : undefined,
        content: {
          value: this.content,
          _type: "Text",
        },
        _type: this.direction,
      },
    });
    $.export("$summary", `Added message to conversation ${this.conversationId}`);
    return response;
  },
};
