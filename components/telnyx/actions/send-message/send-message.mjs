import telnyxApp from "../../telnyx.app.mjs";

export default {
    key: "telnyx-send-message",
    name: "Send Message",
    description: "Send an SMS or MMS message. See documentation [here](https://developers.telnyx.com/docs/messaging/messages/send-message)",
    version: "0.1.12",
    type: "action",
    props: {
        telnyxApp,
        messaging_profile_id: {
            optional: true,
            propDefinition: [
                telnyxApp,
                "messaging_profile_id",
            ],
        },
        to: {
            type: "string",
            label: "To",
            description: "Receiving address (+E.164 formatted phone number or short code).",
        },
        from: {
            type: "string",
            label: "From",
            description: "Sending address (+E.164 formatted phone number or short code). Required if sending with a phone number, short code, or alphanumeric sender ID. See [Sending a message on the Telnyx platform](https://developers.telnyx.com/docs/messaging/messages/send-message) for more details.",
            optional: true,
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
        media_urls: {
            type: "string[]",
            label: "Media URLs",
            description: "URLs of media files to send with the message.",
            optional: true,
        },
        webhook_url: {
            type: "string",
            label: "Webhook URL",
            description: "URL to send delivery receipts to. Must be a valid URL.",
            optional: true,
        },
        webhook_failover_url: {
            type: "string",
            label: "Webhook Failover URL",
            description: "URL to send delivery receipts to if the primary webhook fails. Must be a valid URL.",
            optional: true,
        },
        use_profile_webhooks: {
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
            options: ["SMS", "MMS"],
        },
        auto_detect: {
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
                from: this.from,
                text: this.text,
                messaging_profile_id: this.messaging_profile_id,
                subject: this.subject,
                media_urls: this.media_urls,
                webhook_url: this.webhook_url,
                webhook_failover_url: this.webhook_failover_url,
                use_profile_webhooks: this.use_profile_webhooks,
                type: this.type,
                auto_detect: this.auto_detect,
            },
        });
        $.export("$summary", `Successfully sent SMS/MMS message with Id: ${response.data.id}`);
        return response;
    },
}