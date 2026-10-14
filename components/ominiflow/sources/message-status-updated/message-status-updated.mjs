import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-message-status-updated",
  name: "Message Status Updated (Instant)",
  description: "Emit new event when an outbound WhatsApp message status changes (Sent, Delivered, Read, Failed)",
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
      const id = `${statusEvent?.id || Date.now()}_${statusEvent?.status || "update"}`;
      const status = statusEvent?.status || "unknown";
      const recipient = statusEvent?.recipient_id || statusEvent?.phone || "recipient";
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
