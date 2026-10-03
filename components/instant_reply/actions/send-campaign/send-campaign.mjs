import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-send-campaign",
  name: "Create Broadcast Campaign",
  description: "Create a broadcast campaign for an opted-in audience, with an optional immediate send. [See the documentation](https://www.instantreply.co/api-reference)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
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
      description: "Schedule the campaign for a future time in ISO 8601 format. Leave blank to save as a draft.",
      optional: true,
    },
    contactTags: {
      type: "string[]",
      label: "Audience Tags",
      description: "Tags identifying the opted-in audience. At least one tag is required.",
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
    if (!this.contactTags?.length) throw new Error("Select at least one opted-in audience tag.");
    if (!this.templateId && !this.messageBody?.trim()) throw new Error("Provide an approved template ID or message body.");
    if (this.channel === "whatsapp" && !this.templateId) throw new Error("WhatsApp broadcasts require an approved template ID.");
    if (this.sendImmediately && this.scheduledAt) throw new Error("Choose immediate send or a schedule, not both.");
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
        audience: { tags: this.contactTags },
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
