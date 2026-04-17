import app from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-inbound-message",
  name: "New Inbound Message (Instant)",
  description: "Emit new event when an inbound message is received.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      await this.app.updatePipedreamWebhook(this.http.endpoint);
    },
    async deactivate() {
      await this.app.deactivatePipedreamWebhook(this.http.endpoint);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.webhook_id || body.message_id,
      summary: body.contact
        ? `New inbound message from ${body.contact}`
        : "New inbound received",
      ts: body.created_at
        ? Date.parse(body.created_at)
        : Date.now(),
    });

    this.http.respond({
      status: 200,
    });
  },
};
