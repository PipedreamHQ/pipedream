import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-reply-to-side-conversation",
  name: "Reply to Side Conversation",
  description: "Reply to an existing Zendesk side conversation. Zendesk requires recipients on every reply, so pass the participants the reply should go to. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#reply-to-side-conversation)",
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
      description: "Recipients for this reply, as a JSON array of participant objects. Zendesk requires this on every reply, and returns `Invalid parameter: to is required` when it is omitted, so repeat the participants the reply should go to (read them with **Get Side Conversation**). Use `[{\"email\":\"person@example.com\",\"name\":\"Person\"}]` for an external email recipient or `[{\"user_id\":123}]` for an existing Zendesk agent. Do not mix participant types in the same array.",
    },
    subject: {
      propDefinition: [
        zendesk,
        "sideConversationSubject",
      ],
      optional: true,
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
          ...(this.subject && {
            subject: this.subject,
          }),
          body: this.body,
          to: this.zendesk.parseSideConversationRecipients(this.recipients),
        },
      },
    });

    step.export("$summary", `Successfully replied to side conversation ${response.side_conversation.id}`);

    return response;
  },
};
