import vitally from "../../vitally.app.mjs";

export default {
  key: "vitally-create-message",
  name: "Create Message",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new message. [See the documentation](https://docs.vitally.io/pushing-data-to-vitally/rest-api/messages#create-a-message-post)",
  type: "action",
  props: {
    vitally,
    organizationId: {
      propDefinition: [
        vitally,
        "organizationId",
      ],
    },
    conversationId: {
      propDefinition: [
        vitally,
        "conversationId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    externalId: {
      propDefinition: [
        vitally,
        "externalId",
      ],
      description: "The unique ID of the message in your system.",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The ISO-formatted string timestamp of when the message was sent.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The HTML content of the message.",
    },
    from: {
      propDefinition: [
        vitally,
        "assignedToId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      label: "From",
      description: "The sender participant.",
    },
    to: {
      propDefinition: [
        vitally,
        "assignedToId",
      ],
      type: "string[]",
      label: "To",
      description: "List of the recipient participants.",
    },
    cc: {
      propDefinition: [
        vitally,
        "assignedToId",
      ],
      type: "string[]",
      label: "CC",
      description: "List of the cc recipient participants.",
      optional: true,
    },
    bcc: {
      propDefinition: [
        vitally,
        "assignedToId",
      ],
      type: "string[]",
      label: "BCC",
      description: "List of the bcc recipient participants.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      vitally,
      organizationId,
      conversationId,
      from,
      to,
      cc,
      bcc,
      ...data
    } = this;

    const response = await vitally.createMessage({
      $,
      organizationId,
      conversationId,
      data: {
        ...data,
        from: {
          type: "user",
          id: from,
        },
        to: to && to.map((id) => ({
          type: "user",
          id,
        })),
        cc: cc && cc.map((id) => ({
          type: "user",
          id,
        })),
        bcc: bcc && bcc.map((id) => ({
          type: "user",
          id,
        })),
      },
    });

    $.export("$summary", `A new message with Id: ${response.id} was successfully created!`);
    return response;
  },
};
