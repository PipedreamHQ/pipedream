import crypto from "crypto";
import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-message-status-updated",
  name: "Message Status Updated (Instant)",
  description: "Emit new event when an outbound WhatsApp message status changes (Sent, Delivered, Read, Failed). [See the documentation](https://ominiflow.com/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ominiflow,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    generateMeta(statusEvent) {
      const status = statusEvent?.status || "unknown";
      const recipient = statusEvent?.recipient_id || statusEvent?.phone || "recipient";
      const rawId = `${statusEvent?.id || statusEvent?.message_id || recipient}_${status}`;
      const id = crypto.createHash("sha256").update(String(rawId)).digest("hex").slice(0, 32);

      return {
        id,
        summary: `Message to ${recipient} status updated: ${status}`,
        ts: statusEvent?.timestamp ? Number(statusEvent.timestamp) * 1000 : Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;

    // Acknowledge webhook delivery
    this.http.respond({
      status: 200,
      body: { received: true },
    });

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
