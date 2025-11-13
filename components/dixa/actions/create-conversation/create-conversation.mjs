import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-create-conversation",
  name: "Create Conversation",
  description: "Creates a new email or contact form-based conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/postConversations).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dixa,
    requesterId: {
      propDefinition: [
        dixa,
        "endUserId",
      ],
      label: "Requester Id",
    },
    direction: {
      propDefinition: [
        dixa,
        "direction",
      ],
      reloadProps: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "For outbound, only Email is supported. Inbound also supports ContactForm.",
      options: [
        "Email",
        "ContactForm",
      ],
    },
    emailIntegrationId: {
      propDefinition: [
        dixa,
        "emailIntegrationId",
      ],
    },
    subject: {
      propDefinition: [
        dixa,
        "subject",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content message.",
    },
    language: {
      propDefinition: [
        dixa,
        "language",
      ],
      optional: true,
    },
    agentId: {
      propDefinition: [
        dixa,
        "agentId",
      ],
      optional: true,
    },
  },
  async additionalProps(props) {
    props.agentId.hidden = !(this.direction === "Outbound");
    props.channel.options = this.direction === "Outbound"
      ? [
        "Email",
      ]
      : [
        "ContactForm",
        "Email",
      ];
    return {};
  },
  async run({ $ }) {
    const response = await this.dixa.createConversation({
      $,
      data: {
        subject: this.subject,
        emailIntegrationId: this.emailIntegrationId,
        language: this.language,
        requesterId: this.requesterId,
        message: {
          agentId: this.direction === "Outbound"
            ? this.agentId
            : undefined,
          content: {
            _type: "Text",
            value: this.message,
          },
          _type: this.direction,
        },
        _type: this.channel,
      },
    });
    $.export("$summary", `Created conversation with Id: ${response.data.id}`);
    return response;
  },
};
