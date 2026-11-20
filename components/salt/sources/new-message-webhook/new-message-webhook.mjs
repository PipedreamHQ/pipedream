import {
  createHash, createHmac, timingSafeEqual,
} from "crypto";
import salt from "../../salt.app.mjs";

// A signature outside this many seconds of "now" is refused as stale —
// mirrors salt-api's own SIGNATURE_WINDOW_SECONDS (see docs/AGENT_WEBHOOKS.md
// and Api::V1::CanaryController#authenticated_agent, the reference verifier
// every Salt agent integration mirrors).
const SIGNATURE_WINDOW_SECONDS = 300;

// A malformed, missing, or stale signature never triggers a SUCCESSFUL
// refetch of the webhook secret more than once per this window — otherwise a
// stream of junk POSTs to the public endpoint would let a stranger amplify
// calls to Salt's GET /api/v1/agents/webhook_secret indefinitely.
const SECRET_REFRESH_COOLDOWN_MS = 60_000;

// A FAILED refetch (network error, Salt down, etc.) gets its own, much
// shorter cooldown instead of eating into the 60s success window above —
// otherwise one transient failure would silently block every legitimately
// rotated signature from verifying for a full minute. Still bounded, so a
// flood of malformed requests can't turn this into a rapid-fire amplifier.
const SECRET_REFRESH_FAILURE_RETRY_MS = 5_000;

export default {
  key: "salt-new-message-webhook",
  name: "New Message (Instant)",
  description: "Emit new event each time a message lands in a chat the connected agent belongs"
    + " to — a new 1:1, a group message, or a reply in an open room. A Salt agent has exactly"
    + " **one** callback URL for every kind of delivery it can receive; deploying this source"
    + " claims that URL, and this source only ever emits the plain \"new message\" shape,"
    + " silently discarding every other delivery kind (chat-opened, card taps, paid invoices,"
    + " hand-offs, job offers, its own notification feed) rather than mis-labelling one of"
    + " those as a new message. Deploying a second Salt source — or any other integration that"
    + " sets the same agent's callback — takes over deliveries from this one; there is no API"
    + " to restore a prior callback, so `message.encrypted` on the emitted event tells you"
    + " whether `message.message` is plain text (an open room) or PGP ciphertext (everything"
    + " else, which this source cannot decrypt)."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    salt,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getWebhookSecret() {
      return this.db.get("webhookSecret");
    },
    _setWebhookSecret(secret) {
      this.db.set("webhookSecret", secret);
    },
    async _fetchWebhookSecret() {
      const { webhook_secret: webhookSecret } = await this.salt.getWebhookSecret();
      this._setWebhookSecret(webhookSecret);
      return webhookSecret;
    },
    _getLastSecretRefreshAt() {
      return this.db.get("lastSecretRefreshAt") || 0;
    },
    _setLastSecretRefreshAt(ts) {
      this.db.set("lastSecretRefreshAt", ts);
    },
    _getLastSecretRefreshFailedAt() {
      return this.db.get("lastSecretRefreshFailedAt") || 0;
    },
    _setLastSecretRefreshFailedAt(ts) {
      this.db.set("lastSecretRefreshFailedAt", ts);
    },
    // Shape-and-freshness check only — never the HMAC itself — so a refetch
    // is considered ONLY for a header that could plausibly be a real,
    // clock-synced delivery. A signature this rejects is not "maybe the
    // secret rotated," it is malformed or replayed, and no amount of
    // refetching would ever make it verify.
    _isSignatureWellFormed(signatureHeader) {
      if (!signatureHeader) {
        return false;
      }
      const match = /t=(\d+),v1=([0-9a-f]+)/.exec(signatureHeader);
      if (!match) {
        return false;
      }
      const [
        ,
        timestamp,
      ] = match;
      return Math.abs((Date.now() / 1000) - Number(timestamp)) <= SIGNATURE_WINDOW_SECONDS;
    },
    _verifySignature(rawBody, signatureHeader, secret) {
      if (!signatureHeader || !secret) {
        return false;
      }
      const match = /t=(\d+),v1=([0-9a-f]+)/.exec(signatureHeader);
      if (!match) {
        return false;
      }
      const [
        ,
        timestamp,
        signature,
      ] = match;
      if (Math.abs((Date.now() / 1000) - Number(timestamp)) > SIGNATURE_WINDOW_SECONDS) {
        return false;
      }
      const expected = createHmac("sha256", secret)
        .update(`${timestamp}.${rawBody}`)
        .digest("hex");
      const expectedBuf = Buffer.from(expected, "utf8");
      const signatureBuf = Buffer.from(signature, "utf8");
      return expectedBuf.length === signatureBuf.length
        && timingSafeEqual(expectedBuf, signatureBuf);
    },
    // Every OTHER agent-facing delivery (chat_opened, card_interaction,
    // invoice_paid, handoff_confirmed/received, notification,
    // work_order_offered) carries an explicit `type` (or, for a call event,
    // `event`) discriminator — see the corresponding *Job classes in
    // salt-api/app/jobs. A plain new-message delivery is the one payload
    // shape that predates that convention and carries neither field, so its
    // absence (together with the `chat/message` envelope) is what identifies
    // it, rather than an allowlist of every OTHER kind's exact spelling.
    _isNewMessageEvent(body) {
      return Boolean(body) && typeof body === "object"
        && body.type === undefined && body.event === undefined
        && body.chat && body.message;
    },
  },
  hooks: {
    async activate() {
      // Fetch the secret FIRST: if this fails, activation rejects before
      // Salt's callback has been repointed at all, so a failed deploy never
      // leaves the agent pointed at an endpoint this source can't verify
      // deliveries against yet.
      await this._fetchWebhookSecret();
      await this.salt.setAgentCallback({
        webhook: this.http.endpoint,
      });
    },
    // Salt has no "unregister callback" call (PATCH /api/v1/agents/callback
    // refuses a blank URL), and the current value was never readable by the
    // agent itself in the first place — so there is nothing safe to restore
    // here. See the component description's callout: reconfigure the agent's
    // callback in Salt directly, or replace this source with another one,
    // rather than relying on deactivate() to hand delivery back to whatever
    // held it before.
    async deactivate() {},
  },
  async run(event) {
    const {
      body, headers, rawBody,
    } = event;
    const signatureHeader = headers["x-salt-signature"];
    const deliveryId = headers["x-salt-delivery-id"];

    let secret = this._getWebhookSecret();
    let verified = this._verifySignature(rawBody, signatureHeader, secret);
    if (!verified && this._isSignatureWellFormed(signatureHeader)) {
      // The secret may have rotated (POST /agents/:id/rotate_webhook_secret)
      // since our last fetch — refetch once and retry before giving up.
      // Rate-limited: a signature that's well-formed and within the replay
      // window but still doesn't verify is the ONE real "maybe it rotated"
      // case, and even that gets at most one SUCCESSFUL refetch per cooldown
      // window, so a flood of such requests can't turn this into an
      // amplifier against Salt's own webhook-secret endpoint. A failed
      // refetch only consumes the much shorter failure cooldown, so a single
      // transient error doesn't block real rotations from verifying for a
      // full minute.
      const now = Date.now();
      const pastSuccessCooldown = now - this._getLastSecretRefreshAt() > SECRET_REFRESH_COOLDOWN_MS;
      const pastFailureCooldown = now - this._getLastSecretRefreshFailedAt()
        > SECRET_REFRESH_FAILURE_RETRY_MS;
      if (pastSuccessCooldown && pastFailureCooldown) {
        try {
          secret = await this._fetchWebhookSecret();
          this._setLastSecretRefreshAt(now);
          verified = this._verifySignature(rawBody, signatureHeader, secret);
        } catch (err) {
          this._setLastSecretRefreshFailedAt(now);
        }
      }
    }
    if (!verified) {
      console.log("Salt webhook signature verification failed — discarding delivery");
      return;
    }

    if (!this._isNewMessageEvent(body)) {
      // A real delivery for some other event kind (see the component
      // description) — not an error, just not what this source emits.
      return;
    }

    const {
      chat, message,
    } = body;
    const sender = message.user?.display_name || message.user?.username || message.user?.id;
    const chatLabel = chat.name && chat.name !== "Unnamed Chat"
      ? chat.name
      : `chat ${chat.id}`;
    // A truthy but malformed created_at parses to NaN, which would violate
    // the emitted event's timestamp contract — fall back to now instead.
    const parsedTs = message.created_at
      ? Date.parse(message.created_at)
      : NaN;

    this.$emit(body, {
      // Stable and unique per delivery attempt sequence — see
      // docs/AGENT_WEBHOOKS.md: a retry of the same delivery reuses this id.
      // Hashed rather than the raw concatenation so the fallback (an old
      // delivery predating X-Salt-Delivery-Id) always stays within
      // Pipedream's event-id length limit regardless of message id shape.
      id: deliveryId || createHash("sha256")
        .update(`${message.message_id}-${message.created_at}`)
        .digest("hex"),
      // Deliberately no message content here — `message.message` is PGP
      // ciphertext on every chat but an open room, and even an open room's
      // plain text doesn't belong in a log line or notification.
      summary: `New message from ${sender} in ${chatLabel}`,
      ts: Number.isFinite(parsedTs)
        ? parsedTs
        : Date.now(),
    });
  },
};
