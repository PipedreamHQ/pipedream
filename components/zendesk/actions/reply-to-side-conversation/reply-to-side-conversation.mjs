import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-reply-to-side-conversation",
  name: "Reply to Side Conversation",
  description: "Reply to an existing Zendesk side conversation. Use **List Side Conversations** to discover conversation IDs. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#reply-to-side-conversation).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    zendesk,
    ticketId: {
      propDefinition: [
        zendesk,
        "ticketId",
      ],
    },
    sideConversationId: {
      propDefinition: [
        zendesk,
        "sideConversationId",
        ({
          ticketId, customSubdomain,
        }) => ({
          ticketId,
          customSubdomain,
        }),
      ],
    },
    subject: {
      propDefinition: [
        zendesk,
        "sideConversationSubject",
      ],
      optional: true,
    },
    body: {
      propDefinition: [
        zendesk,
        "sideConversationBody",
      ],
    },
    recipients: {
      propDefinition: [
        zendesk,
        "sideConversationRecipients",
      ],
    },
    customSubdomain: {
      propDefinition: [
        zendesk,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.zendesk.replyToSideConversation({
      step,
      ticketId: this.ticketId,
      sideConversationId: this.sideConversationId,
      customSubdomain: this.customSubdomain,
      data: {
        message: {
          subject: this.subject,
          body: this.body,
          to: this.zendesk.parseSideConversationRecipients(this.recipients),
        },
      },
    });

    step.export("$summary", `Successfully replied to side conversation ${response.side_conversation.id}`);

    return response;
  },
};
