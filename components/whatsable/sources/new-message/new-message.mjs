import { createHash } from "crypto";

export default {
  name: "New Incoming Message",
  description: "Emit new events when Whatsable receives incoming WhatsApp messages",
  key: "whatsable-new-message",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",

  props: {
    http: "$.interface.http",
  },

  async run(event) {
    const payload = event.body;

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid Whatsable webhook payload");
    }

    // Ignore explicitly outgoing messages.
    if (payload.incoming_message === false) {
      return;
    }

    const phone = payload.phone_number || "unknown";
    const messageId =
      payload.message_id ||
      payload.id ||
      payload.user_last_message_id;

    const timestamp =
      payload.user_last_message_time ||
      payload.timestamp ||
      payload.created_at;

    // Use a stable identifier for deduplication.
    const eventIdentifier = messageId
      ? String(messageId)
      : `${phone}-${timestamp || "unknown"}`;

    const id = createHash("sha256")
      .update(eventIdentifier)
      .digest("hex")
      .slice(0, 64);

    const ts = timestamp
      ? new Date(timestamp).getTime()
      : Date.now();

    this.$emit(payload, {
      id,
      summary: `New WhatsApp message from ${payload.recipient_name || phone}`,
      ts,
    });
  },
};
