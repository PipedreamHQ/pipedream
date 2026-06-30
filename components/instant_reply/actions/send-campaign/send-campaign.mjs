import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-send-campaign",
  name: "Create Broadcast Campaign",
  description: "Create and immediately send (or schedule) a WhatsApp broadcast campaign to a segment of your contacts. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "Internal name for this broadcast (not shown to customers)",
    },
    channel: {
      propDefinition: [
        instantReply,
        "channel",
      ],
      description: "Which channel to send the broadcast on. WhatsApp is required for template broadcasts.",
    },
    templateId: {
      propDefinition: [
        instantReply,
        "templateId",
      ],
      optional: true,
      description: "WhatsApp approved template to use. Required for WhatsApp campaigns outside the 24-hour window.",
    },
    messageBody: {
      type: "string",
      label: "Message Body",
      description: "Free-form message text (for Instagram/Messenger, or WhatsApp within the 24-hour window). Either this or Template ID is required.",
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At (ISO 8601)",
      description: "Schedule the campaign for a future time, e.g. 2025-01-15T09:00:00Z. Leave blank to save as a draft.",
      optional: true,
    },
    contactTags: {
      type: "string[]",
      label: "Audience Tags",
      description: "Send to all contacts with these tags. Leave blank to send to all contacts on the selected channel.",
      optional: true,
    },
    sendImmediately: {
      type: "boolean",
      label: "Send Immediately",
      description: "If true, trigger the campaign send immediately after creation. Only use if you are sure your audience is ready.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const campaign = await this.instantReply._makeRequest({
      $,
      method: "POST",
      path: "/campaigns",
      data: {
        name: this.name,
        channel: this.channel,
        template_id: this.templateId || undefined,
        message_body: this.messageBody || undefined,
        scheduled_at: this.scheduledAt || undefined,
        audience: this.contactTags?.length ? { tags: this.contactTags } : undefined,
      },
    });

    if (this.sendImmediately && campaign?.id) {
      const sent = await this.instantReply._makeRequest({
        $,
        method: "POST",
        path: `/campaigns/${campaign.id}/send`,
        data: {},
      });
      $.export("$summary", `Campaign "${this.name}" created and send triggered (status: ${sent?.status})`);
      return sent;
    }

    $.export("$summary", `Campaign "${this.name}" created with status: ${campaign?.status}`);
    return campaign;
  },
};
