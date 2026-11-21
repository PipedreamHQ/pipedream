import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create Scheduled Text Message",
  description: "Schedule a Whatsable text message for future delivery",
  key: "whatsable-create-scheduled-message",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    whatsable,
    to: {
      type: "string",
      label: "Recipient",
      description: "Phone number, WhatsApp user ID, or username",
    },
    from: {
      type: "string",
      label: "From Number",
      description: "Optional Whatsable number ID or E.164 sender",
      optional: true,
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "Text message body (up to 4096 characters)",
    },
    send_at: {
      type: "string",
      label: "Send At",
      description: "Future RFC3339 date-time including timezone offset, e.g. 2026-12-01T09:00:00+06:00",
    },
    preview_url: {
      type: "boolean",
      label: "Preview URL",
      description: "Enable URL preview",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.send_at || !/(Z|[+-]\\d{2}:\\d{2})$/.test(this.send_at)) {
      throw new Error("send_at must be an RFC3339 date-time with an explicit timezone offset.");
    }
    const response = await this.whatsable._makeRequest({
      $,
      method: "POST",
      path: "/scheduled-messages",
      data: {
        to: this.to,
        ...(this.from
          ? {
            from: this.from,
          }
          : {}),
        type: "text",
        text: {
          body: this.text,
          preview_url: this.preview_url ?? false,
        },
        send_at: this.send_at,
      },
    });
    $.export("$summary", "Scheduled Whatsable text message");
    return response;
  },
};
