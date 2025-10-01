import telnyxApp from "../../telnyx.app.mjs";

export default {
  key: "telnyx-send-message",
  name: "Send Message",
  description: "Send an SMS or MMS message. [See the documentation](https://developers.telnyx.com/docs/messaging/messages/send-message)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telnyxApp,
    messagingProfileId: {
      optional: true,
      propDefinition: [
        telnyxApp,
        "messagingProfileId",
      ],
    },
    phoneNumber: {
      optional: true,
      propDefinition: [
        telnyxApp,
        "phoneNumber",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "Receiving address (+E.164 formatted phone number or short code).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Message content. Must be a valid UTF-8 string, and no longer than 1600 characters for SMS or 5MB for MMS. Required if sending an SMS message.",
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
    type: {
      type: "string",
      label: "Type",
      description: "Type of message to sent.",
      optional: true,
      options: [
        "SMS",
        "MMS",
      ],
    },
    autoDetect: {
      type: "boolean",
      label: "Auto Detect",
      description: "Automatically detect if an SMS message is unusually long and exceeds a recommended limit of message parts.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.telnyxApp.sendMessage({
      $,
      data: {
        to: this.to,
        from: this.phoneNumber,
        text: this.text,
        messaging_profile_id: this.messagingProfileId,
        subject: this.subject,
        media_urls: this.mediaUrls,
        webhook_url: this.webhookUrl,
        webhook_failover_url: this.webhookFailoverUrl,
        use_profile_webhooks: this.useProfileWebhooks,
        type: this.type,
        auto_detect: this.autoDetect,
      },
    });
    $.export("$summary", `Successfully sent SMS/MMS message with Id: ${response.data.id}`);
    return response;
  },
};
