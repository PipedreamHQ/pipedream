import { createHash } from "node:crypto";
import alive5 from "../../alive5.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "alive5-new-sms-received",
  name: "New SMS Received",
  description: "Emit new events when a text arrives on an Alive5 SMS number. [See the documentation](https://www.alive5.com/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    alive5,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    smsLine: {
      propDefinition: [
        alive5,
        "smsLine",
      ],
    },
  },
  hooks: {
    async activate() {
      if (this.db.get("subscription")) throw new Error("An Alive5 subscription already exists. Deactivate it before changing the source.");
      const [
        channelId,
        phoneNumber,
      ] = this.smsLine.split("|");
      if (!channelId || !/^\+[1-9]\d{7,14}$/.test(phoneNumber)) throw new Error("Select a valid Alive5 SMS number.");
      const interceptorUuid = await this.alive5.registerWebhook({
        phoneNumber,
        url: this.http.endpoint,
      });
      this.db.set("subscription", {
        phoneNumber,
        interceptorUuid,
      });
    },
    async deactivate() {
      const subscription = this.db.get("subscription");
      if (!subscription) return;
      await this.alive5.deleteWebhook(subscription);
      this.db.set("subscription", null);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "Accepted",
    });
    const body = event.body;
    if (!body || typeof body !== "object" || Array.isArray(body) || body.direction !== "inbound" || typeof body.message_content !== "string" || !body.message_content.trim()) return;
    const timestamp = Number(body.created_at);
    const millis = timestamp < 1e11
      ? timestamp * 1000
      : timestamp;
    const receivedAt = Number.isFinite(millis) && millis > 0 && millis < 1e13
      ? millis
      : Date.now();
    const subscription = this.db.get("subscription");
    if (!subscription) return;
    const identity = body.thread_id && body.created_at
      ? [
        body.thread_id,
        body.created_at,
        body.message_content,
        body.direction,
      ]
      : body;
    const id = createHash("sha256").update(JSON.stringify(identity))
      .digest("hex");
    this.$emit({
      message: body.message_content,
      from_phone: body.created_by || body.phone_mobile || null,
      business_line: subscription.phoneNumber,
      channel_id: body.channel_id || null,
      thread_id: body.thread_id || null,
      direction: "inbound",
      received_at: new Date(receivedAt).toISOString(),
      media_url: body.media_url || null,
    }, {
      id,
      summary: "New inbound SMS",
      ts: receivedAt,
    });
  },
  sampleEmit,
};
