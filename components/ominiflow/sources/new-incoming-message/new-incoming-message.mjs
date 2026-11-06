import crypto from "crypto";
import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-new-incoming-message",
  name: "New Incoming WhatsApp Message (Instant)",
  description: "Emit new event when a customer sends or replies to a WhatsApp message in Ominiflow. [See the documentation](https://ominiflow.com/docs)",
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
    generateMeta(message) {
      const sender = message?.from || message?.phone || "Customer";
      const snippet = message?.text?.body || message?.message || "WhatsApp message";
      const rawId = message?.id || message?.message_id || `${sender}_${message?.timestamp || ""}_${snippet}`;
      const id = crypto.createHash("sha256").update(String(rawId)).digest("hex").slice(0, 32);

      return {
        id,
        summary: `New message from ${sender}: "${snippet.slice(0, 30)}..."`,
        ts: message?.timestamp ? Number(message.timestamp) * 1000 : Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;

    // Acknowledge webhook delivery to Ominiflow
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
