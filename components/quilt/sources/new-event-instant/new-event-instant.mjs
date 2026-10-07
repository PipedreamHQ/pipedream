import crypto from "crypto";
import quilt from "../../quilt.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "quilt-new-event-instant",
  name: "New Mention, Message or Task (Instant)",
  description: "Emit new event when the connected agent is mentioned in chat (@name), sent a direct message or handed a task in its Quilt session. Join a session first (**Join Session** action). Quilt keeps one webhook per agent, so give each of these triggers its own agent (its own app key). [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#webhooks-an-agent-sets-up-its-own-push)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    quilt,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    events: {
      type: "string[]",
      label: "Events",
      description: "Which events to emit. Leave empty for all of them.",
      options: constants.WEBHOOK_EVENTS,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const secret = crypto.randomBytes(24).toString("hex");
      await this.quilt.callTool({
        name: "quilt_webhook_subscribe",
        args: {
          url: this.http.endpoint,
          secret,
          events: this.events,
        },
      });
      this._setSecret(secret);
    },
    async deactivate() {
      await this.quilt.callTool({
        name: "quilt_webhook_unsubscribe",
      });
      this._setSecret(null);
    },
  },
  methods: {
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _header(headers, name) {
      const key = Object.keys(headers || {}).find((k) => k.toLowerCase() === name);
      return key
        ? String(headers[key])
        : "";
    },
    /** Quilt signs `<timestamp>.<body>` with HMAC-SHA256 and the subscription's secret. */
    _isSigned({
      headers, bodyRaw,
    }) {
      const secret = this._getSecret();
      const ts = this._header(headers, "x-quilt-timestamp");
      const signature = this._header(headers, "x-quilt-signature");
      if (!secret || !ts || !signature || typeof bodyRaw !== "string") return false;
      if (Math.abs(Date.now() - Number(ts)) > constants.WEBHOOK_TOLERANCE_MS) return false;
      const want = Buffer.from("sha256=" + crypto.createHmac("sha256", secret).update(`${ts}.${bodyRaw}`)
        .digest("hex"));
      const got = Buffer.from(signature);
      return want.length === got.length && crypto.timingSafeEqual(want, got);
    },
    generateMeta(body) {
      const what = {
        "chat.mention": `Mentioned by ${body.by}`,
        "chat.dm": `Direct message from ${body.by}`,
        "task.assigned": `Task from ${body.by}: ${body.task?.title || body.text}`,
      }[body.event] || body.event;
      return {
        id: `${body.event}:${body.id}`,
        summary: what.slice(0, 200),
        ts: Number(body.ts) || Date.now(),
      };
    },
  },
  async run(event) {
    if (!this._isSigned(event)) {
      this.http.respond({
        status: 401,
        body: "invalid signature",
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    const body = event.body;
    this.$emit(body, this.generateMeta(body));
  },
};
