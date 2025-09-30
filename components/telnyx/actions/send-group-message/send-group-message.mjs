import telnyxApp from "../../telnyx.app.mjs";

export default {
  key: "telnyx-send-group-message",
  name: "Send Group Message",
  description: "Send a group MMS message. [See the documentation](https://developers.telnyx.com/api/messaging/create-group-mms-message)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telnyxApp,
    phoneNumber: {
      optional: true,
      propDefinition: [
        telnyxApp,
        "phoneNumber",
      ],
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Receiving list of destinations. No more than 8 destinations are allowed.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Message content. Must be a valid UTF-8 string, and no longer then 5MB for MMS.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the MMS message.",
      optional: true,
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "URLs of media files to send with the message.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to send delivery receipts to. Must be a valid URL.",
      optional: true,
    },
    webhookFailoverUrl: {
      type: "string",
      label: "Webhook Failover URL",
      description: "URL to send delivery receipts to if the primary webhook fails. Must be a valid URL.",
      optional: true,
    },
    useProfileWebhooks: {
      type: "boolean",
      label: "Use Profile Webhooks",
      description: "Whether to use the messaging profile's webhook URL for delivery receipts.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.telnyxApp.sendGroupMessage({
      $,
      data: {
        to: this.to,
        from: this.phoneNumber,
        text: this.text,
        subject: this.subject,
        media_urls: this.mediaUrls,
        webhook_url: this.webhookUrl,
        webhook_failover_url: this.webhookFailoverUrl,
        use_profile_webhooks: this.useProfileWebhooks,
      },
    });
    $.export("$summary", `Successfully sent MMS message with Id: ${response.data.id}`);
    return response;
  },
};
