import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Send Text Message",
  description: "Send a text message through Whatsable",
  key: "whatsable-send-text-message",
  version: "0.0.1",
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
      description: "Recipient phone number, business-scoped ID, or WhatsApp username",
    },
    from: {
      type: "string",
      label: "From Number (Optional)",
      description: "Sending Whatsable number ID or E.164 phone number. Leave blank to use your default number.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Message",
      description: "Text message body",
    },
    preview_url: {
      type: "boolean",
      label: "Preview URLs",
      description: "Enable link previews in the message",
      default: false,
      optional: true,
    },
    pause_ai: {
      type: "boolean",
      label: "Pause AI",
      description: "Pause AI automation for this message",
      default: false,
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable.sendMessage({
      $,
      headers: {
        "Idempotency-Key": `${Date.now()}-${Math.random()}`,
      },
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
        pause_ai: this.pause_ai ?? false,
      },
    });

    $.export(
      "$summary",
      `Message request created for ${this.to}`,
    );

    return response;
  },
};
