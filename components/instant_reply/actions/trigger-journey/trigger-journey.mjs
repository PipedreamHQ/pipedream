import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-trigger-journey",
  name: "Trigger WhatsApp Journey",
  description: "Enroll a phone number into a WhatsApp automation journey. Use this to send sequences triggered by CRM events, form submissions, or payment confirmations. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The recipient's phone number. Accepts E.164 (+971...), 00971..., or local formats — normalised automatically.",
    },
    triggerName: {
      type: "string",
      label: "Journey Trigger Name",
      description: "The stable slug you configured on the journey (e.g. 'new_signup', 'trial_expired'). Either this or Journey ID is required.",
      optional: true,
    },
    journeyId: {
      type: "string",
      label: "Journey ID",
      description: "UUID of the WhatsApp journey. Use Trigger Name instead if you want a stable identifier that doesn't change when you recreate journeys.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Template Variables",
      description: "Key-value pairs injected into the journey's WhatsApp template (e.g. { name: 'Ahmed', order_id: '1234' })",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Supply your internal event ID to make retries safe. Duplicate calls with the same key within 24 hours are de-duplicated.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantReply._makeRequest({
      $,
      method: "POST",
      path: "/trigger",
      data: {
        phone: this.phone,
        trigger_name: this.triggerName || undefined,
        journey_id: this.journeyId || undefined,
        metadata: this.metadata || undefined,
        idempotency_key: this.idempotencyKey || undefined,
      },
    });
    $.export("$summary", `Journey triggered for ${this.phone} — status: ${response?.data?.status ?? 'sent'}`);
    return response;
  },
};
