import { timingSafeEqual } from "node:crypto";
import alive5 from "../../alive5.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "alive5-new-sms-received",
  name: "New SMS Received",
  description: "Emit new events when a text arrives on an Alive5 SMS number. [See the documentation](https://www.alive5.com/api)",
  version: "0.0.2",
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
  methods: {
    _getSubscription() {
      return this.db.get("subscription");
    },
    _setSubscription(subscription) {
      this.db.set("subscription", subscription);
    },
  },
  hooks: {
    async activate() {
      if (this._getSubscription()) throw new Error("An Alive5 subscription already exists. Deactivate it before changing the source.");
      const [
        channelId,
        phoneNumber,
      ] = this.smsLine.split("|");
      if (!channelId || !/^\+[1-9]\d{7,14}$/.test(phoneNumber)) throw new Error("Select a valid Alive5 SMS number.");
      const subscription = await this.alive5.createSubscription({
        phoneNumber,
        url: this.http.endpoint,
      });
      this._setSubscription(subscription);
    },
    async deactivate() {
      const subscription = this._getSubscription();
      if (!subscription) return;
      await this.alive5.deleteSubscription({
        id: subscription.id,
      });
      this._setSubscription(null);
    },
  },
  async run(event) {
    const body = event.body;
    const subscription = this._getSubscription();
    const relayToken = Object.entries(event.headers || {})
      .find(([
        name,
      ]) => name.toLowerCase() === "x-alive5-relay-token")?.[1];
    const suppliedToken = Buffer.from(typeof relayToken === "string"
      ? relayToken
      : "");
    const savedToken = Buffer.from(typeof subscription?.deliveryToken === "string"
      ? subscription.deliveryToken
      : "");
    const tokenMatches = savedToken.length > 0 && suppliedToken.length === savedToken.length
      && timingSafeEqual(suppliedToken, savedToken);
    if (event.method !== "POST" || !subscription || !tokenMatches) {
      this.http.respond({
        status: event.method !== "POST"
          ? 405
          : 401,
        body: "Rejected",
      });
      return;
    }
    if (!body || typeof body !== "object" || Array.isArray(body)
      || typeof body.event_id !== "string" || !body.event_id
      || typeof body.message !== "string" || !body.message.trim()
      || body.direction !== "inbound" || typeof body.received_at !== "string"
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(body.received_at)
      || !Number.isFinite(Date.parse(body.received_at))) {
      this.http.respond({
        status: 400,
        body: "Rejected",
      });
      return;
    }
    this.http.respond({
      status: 200,
      body: "Accepted",
    });
    this.$emit({
      message: body.message,
      from_phone: typeof body.from_phone === "string"
        ? body.from_phone
        : null,
      business_line: subscription.phoneNumber,
      channel_id: typeof body.channel_id === "string"
        ? body.channel_id
        : null,
      thread_id: typeof body.thread_id === "string"
        ? body.thread_id
        : null,
      direction: "inbound",
      received_at: new Date(body.received_at).toISOString(),
      media_url: typeof body.media_url === "string"
        ? body.media_url
        : null,
    }, {
      id: body.event_id,
      summary: "New inbound SMS",
      ts: Date.parse(body.received_at),
    });
  },
  sampleEmit,
};
