import { createHash } from "crypto";

export default {
  name: "New Incoming WhatsApp Message",
  description: "Emit new Whatsable incoming message events.",
  key: "whatsable-new-message",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    http: "$.interface.http",
  },
  async run(event) {
    const payload = event.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Invalid Whatsable webhook payload: expected an object.");
    }
    // Configure this source with an incoming-only webhook in Whatsable.
    // Payloads may omit a message ID; phone + documented message timestamp is the fallback.
    const phone = payload.phone_number || "unknown";
    const timestamp = payload.user_last_message_time ?? payload.timestamp ?? payload.created_at;
    const eventIdentifier = `${phone}-${timestamp ?? "unknown"}`;
    const id = createHash("sha256").update(eventIdentifier)
      .digest("hex");
    const timestampNumber = Number(timestamp);
    const ts = Number.isFinite(timestampNumber)
      ? (timestampNumber > 1e12
        ? timestampNumber
        : timestampNumber * 1000)
      : (timestamp
        ? new Date(timestamp).getTime()
        : Date.now());
    this.$emit(payload, {
      id,
      summary: `Incoming WhatsApp message from ${payload.recipient_name || phone}`,
      ts: Number.isFinite(ts)
        ? ts
        : Date.now(),
    });
  },
};
