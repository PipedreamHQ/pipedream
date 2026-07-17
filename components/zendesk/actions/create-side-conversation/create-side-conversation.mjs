import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-create-side-conversation",
  name: "Create Side Conversation",
  description: "Create a side conversation on a Zendesk ticket using email, Slack, Microsoft Teams, or child-ticket participants. Use **List Side Conversations** to inspect existing conversations. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#create-side-conversation).",
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
    subject: {
      propDefinition: [
        zendesk,
        "sideConversationSubject",
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
    },
    customSubdomain: {
      propDefinition: [
        zendesk,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.zendesk.createSideConversation({
      step,
      ticketId: this.ticketId,
      customSubdomain: this.customSubdomain,
      data: {
        message: {
          subject: this.subject,
          body: this.body,
          to: this.zendesk.parseSideConversationRecipients(this.recipients),
        },
      },
    });

    step.export("$summary", `Successfully created side conversation ${response.side_conversation.id}`);

    return response;
  },
};
