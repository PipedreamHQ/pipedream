import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import muziekMakenMetAi from "../../muziek_maken_met_ai.app.mjs";

const SIGNATURE_PREFIX = "sha256=";

export default {
  key: "muziek_maken_met_ai-new-song-ready",
  name: "New Song Ready",
  description: "Emit new event when a song generation succeeds, including the audio URLs. The API key holds a single webhook: activating this source registers it and replaces any webhook registered earlier with the same key; deactivating the source unregisters the webhook again. [See the documentation](https://muziekmakenmetai.nl/developers/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    muziekMakenMetAi,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.muziekMakenMetAi.setWebhookUrl(this.http.endpoint);
      const signingSecret = response.signing_secret;
      if (!signingSecret) {
        throw new Error("The API did not return a signing secret for the webhook; incoming events cannot be verified.");
      }
      this.db.set("signingSecret", signingSecret);
    },
    async deactivate() {
      await this.muziekMakenMetAi.setWebhookUrl("");
      this.db.set("signingSecret", null);
    },
  },
  methods: {
    /**
     * Verify the `x-mmai-signature` header against the raw request body.
     * The signature is HMAC-SHA256 over `<timestamp>.<raw body>`, hex-encoded
     * and prefixed with `sha256=`.
     *
     * @param {string} signingSecret - the signing secret stored at activation
     * @param {object} event - the HTTP event delivered by Pipedream
     * @returns {boolean} whether the signature is valid
     */
    verifySignature(signingSecret, event) {
      if (!signingSecret || !event?.bodyRaw) {
        return false;
      }
      const headers = event.headers ?? {};
      const getHeader = (name) => headers[name] ?? headers[name.toLowerCase()];
      const timestamp = getHeader("x-mmai-timestamp");
      const received = getHeader("x-mmai-signature");
      if (!timestamp || !received) {
        return false;
      }
      const rawBody = Buffer.isBuffer(event.bodyRaw)
        ? event.bodyRaw
        : Buffer.from(event.bodyRaw, "utf8");
      const message = Buffer.concat([
        Buffer.from(`${timestamp}.`, "utf8"),
        rawBody,
      ]);
      const expected = SIGNATURE_PREFIX + createHmac("sha256", signingSecret).update(message)
        .digest("hex");
      const expectedBuffer = Buffer.from(expected, "utf8");
      const receivedBuffer = Buffer.from(String(received).trim(), "utf8");
      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }
      return timingSafeEqual(expectedBuffer, receivedBuffer);
    },
  },
  async run(event) {
    const signingSecret = this.db.get("signingSecret");
    if (!this.verifySignature(signingSecret, event)) {
      this.http.respond({
        status: 401,
      });
      return;
    }

    let body = {};
    try {
      body = typeof event.body === "object" && event.body !== null
        ? event.body
        : JSON.parse(event.bodyRaw);
    } catch {
      body = {};
    }

    this.http.respond({
      status: 200,
    });

    if (body.type !== "music.generation.succeeded") {
      return;
    }

    const data = body.data ?? {};
    const headers = event.headers ?? {};
    const getHeader = (name) => headers[name] ?? headers[name.toLowerCase()];
    const eventId = String(getHeader("x-mmai-event") ?? body.id ?? data.id ?? "");
    const emittedAt = Date.parse(data.finished_at ?? "");

    this.$emit({
      ...data,
      event_id: eventId,
      event_type: body.type,
    }, {
      id: eventId || String(data.id ?? Date.now()),
      summary: `New song ready: ${data.title ?? data.id ?? "unnamed generation"}`,
      ts: Number.isNaN(emittedAt)
        ? Date.now()
        : emittedAt,
    });
  },
};
