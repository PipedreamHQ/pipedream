import textkit from "../../textkit.app.mjs";
import { parseList } from "../../common/utils.mjs";

export default {
  key: "textkit-send-sms",
  name: "Send SMS",
  description: "Send a text message to one phone number."
    + " Returns the message with its `id` and `status`; a message sent during the recipient's quiet hours comes back as a `scheduled_message` that goes out later."
    + " Use **List Messages** to check delivery later."
    + " With a test key (`tk_sk_test_...`) nothing reaches a real phone, and `+15005550006` always ends `delivered`."
    + " [See the documentation](https://jointextkit.com/docs/messages)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
    to: {
      type: "string",
      label: "To",
      description: "Recipient phone number in E.164 format (e.g. `+14155550132`)",
    },
    body: {
      type: "string",
      label: "Message",
      description: "Text to send, up to 1,600 characters (e.g. `Your order has shipped.`)",
    },
    from: {
      propDefinition: [
        textkit,
        "from",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "What kind of message this is. One of `transactional`, `marketing`, `otp`, e.g. `transactional`. Defaults to `transactional`. Marketing messages follow stricter quiet-hours and consent rules.",
      options: [
        "transactional",
        "marketing",
        "otp",
      ],
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "Send later instead of now, as an ISO 8601 timestamp up to 30 days out (e.g. `2026-11-01T15:00:00Z`)",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Up to 10 labels for filtering and reporting (e.g. `onboarding`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.textkit.sendMessage({
      $,
      data: {
        to: this.to,
        body: this.body,
        from: this.from || undefined,
        category: this.category || undefined,
        scheduled_at: this.scheduledAt
          ? new Date(this.scheduledAt).toISOString()
          : undefined,
        tags: parseList(this.tags),
      },
    });
    $.export("$summary", response.object === "scheduled_message"
      ? `Scheduled SMS to ${this.to} for ${response.scheduled_at}`
      : `Sent SMS to ${this.to} (${response.status})`);
    return response;
  },
};
