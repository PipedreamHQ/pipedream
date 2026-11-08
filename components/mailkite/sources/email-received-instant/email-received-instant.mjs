import crypto from "crypto";
import mailkite from "../../mailkite.app.mjs";
import { toEmailReceivedEvent } from "../../common/message-to-event.mjs";
import sampleEmit from "./test-event.mjs";

// Reject a delivery whose signature timestamp is further than this from now, in either
// direction, so a captured delivery cannot be replayed forever. Same window the MailKite
// SDKs enforce (`DEFAULT_TOLERANCE_MS` in `sdks/node/index.js`).
export const FRESHNESS_MS = 5 * 60 * 1000;

// deploy() backfill bounds. Pipedream's guideline is at most 50 historical events on first
// deploy. `/api/messages` has no domain or direction filter, so those 50 are selected
// client-side out of pages of the account's newest mail — hence a page size and a page cap
// (50 for this domain could otherwise walk the whole account).
export const BACKFILL_LIMIT = 50;
export const BACKFILL_PAGE_SIZE = 200; // the API's maximum `limit`
export const BACKFILL_MAX_PAGES = 5;

export default {
  key: "mailkite-email-received-instant",
  name: "New Inbound Email (Instant)",
  description:
    "Emit new event when an email arrives at a verified MailKite domain. A domain has a single " +
    "catch-all webhook route, so deploying this source takes it over; whatever the domain pointed " +
    "at before is restored when the source is deleted. [See the documentation](https://mailkite.dev/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=components).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    // The source itself only reads mail as it arrives, but its lifecycle hooks write the
    // domain's webhook route (PUT on activate, restore-or-delete on deactivate) — so it is
    // not read-only. Nothing it does is irreversible: deactivate() puts back the webhook the
    // domain had before, rather than dropping it.
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailkite,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    domainId: {
      propDefinition: [
        mailkite,
        "domainId",
      ],
    },
    webhookSecret: {
      type: "string",
      secret: true,
      label: "Webhook Signing Secret Override",
      description:
        "Signature verification (HMAC-SHA256) is on by default using the secret MailKite issues " +
        "when this source registers its webhook — no setup needed. Set this only to override that " +
        "secret (e.g. it was rotated in the MailKite dashboard → **Webhooks**).",
      optional: true,
    },
    ackMode: {
      type: "string",
      label: "Acknowledgement Mode",
      description:
        "`lenient` (default) accepts any 2xx response. `ack` requires this source to confirm receipt — MailKite retries until it does.",
      options: [
        "lenient",
        "ack",
      ],
      default: "lenient",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Backfill so the source is not empty until the next email arrives. Bounded at
      // BACKFILL_LIMIT events per Pipedream's guideline; emitted oldest-first so the event
      // list reads chronologically, and keyed on the message id, so the live webhook for a
      // message that arrives mid-backfill is deduped rather than emitted twice.
      const rows = await this.listBackfillRows();
      for (const row of rows.slice().reverse()) {
        try {
          const {
            message, attachments,
          } = await this.mailkite.getMessage({
            messageId: row.id,
          });
          this.emitEvent(toEmailReceivedEvent(message, attachments));
        } catch (err) {
          // One unreadable message must not cost the user the other 49.
          console.log(`Skipped ${row.id} during backfill: ${err.message}`);
        }
      }
    },
    async activate() {
      // A domain has one catch-all webhook route. Stash whatever is there before we replace
      // it, so deactivate() can put it back instead of deleting the user's existing wiring.
      const incumbent = await this.mailkite.getDomain({
        domainId: this.domainId,
      });
      this.db.set(
        "incumbentWebhook",
        incumbent?.webhookUrl
          ? { url: incumbent.webhookUrl, ackMode: incumbent.webhookAckMode ?? "lenient" }
          : null,
      );

      const { webhookUrl, signingSecret } = await this.mailkite.setWebhook({
        domainId: this.domainId,
        data: {
          url: this.http.endpoint,
          ackMode: this.ackMode,
        },
      });
      this.db.set("webhookUrl", webhookUrl);
      // Persist the secret MailKite just handed us so verification is on by default; the
      // `webhookSecret` prop remains only as an override (see run()).
      this.db.set("signingSecret", signingSecret);
    },
    async deactivate() {
      const incumbent = this.db.get("incumbentWebhook");
      if (incumbent) {
        await this.mailkite.setWebhook({
          domainId: this.domainId,
          data: {
            url: incumbent.url,
            ackMode: incumbent.ackMode,
          },
        });
      } else {
        await this.mailkite.deleteWebhook({
          domainId: this.domainId,
        });
      }
    },
  },
  methods: {
    /**
     * Emit one `email.received` payload, from either path — the live webhook or the deploy()
     * backfill — so both produce identical events.
     *
     * `ts` is the message's arrival time, not the clock: a backfilled event has to land in the
     * timeline where the email actually arrived, and for a live delivery the two are the same
     * instant anyway.
     *
     * @param {object} payload - An `email.received` event body.
     */
    emitEvent(payload) {
      this.$emit(payload, {
        id: payload.id,
        summary: `New email from ${payload.from?.address}: ${payload.subject ?? "(no subject)"}`,
        ts: payload.receivedAt ?? Date.now(),
      });
    },
    /**
     * Select the messages deploy() should backfill: inbound mail to the chosen domain, newest
     * first, at most BACKFILL_LIMIT of them.
     *
     * Every filter here exists because `GET /api/messages` cannot express it. The endpoint has
     * no domain filter and no direction filter, so it returns the account's outbound sends and
     * every other domain's mail too; and rows whose bodies are encrypted at rest (`enc_key_fp`)
     * are stored as ciphertext the API never decrypts, so backfilling one would emit an event
     * whose `text`/`html` are unreadable — those are skipped and counted in the log instead.
     *
     * @returns {Promise<object[]>} Selected list rows, newest first.
     */
    async listBackfillRows() {
      const domain = await this.mailkite.getDomain({
        domainId: this.domainId,
      });
      const suffix = `@${String(domain?.domain ?? "").toLowerCase()}`;
      const selected = [];
      const seen = new Set();
      let encrypted = 0;
      let before;
      for (let page = 0; page < BACKFILL_MAX_PAGES && selected.length < BACKFILL_LIMIT; page++) {
        const rows = await this.mailkite.listMessages({
          limit: BACKFILL_PAGE_SIZE,
          before,
        });
        if (!rows?.length) break;
        let fresh = 0;
        for (const row of rows) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
          fresh++;
          if (selected.length >= BACKFILL_LIMIT) continue;
          if (row.direction !== "inbound") continue;
          if (!String(row.to_addr ?? "").toLowerCase().endsWith(suffix)) continue;
          if (row.enc_key_fp) {
            encrypted++;
            continue;
          }
          selected.push(row);
        }
        // `before` is exclusive, so paging on the last row's timestamp would drop any row
        // sharing that millisecond; `+ 1` keeps them and `seen` absorbs the re-read overlap.
        // A page that is entirely overlap means the cursor cannot advance — stop rather than
        // spin. A short page is the end of the list.
        if (!fresh || rows.length < BACKFILL_PAGE_SIZE) break;
        before = rows[rows.length - 1].received_at + 1;
      }
      if (encrypted) {
        console.log(
          `Backfill skipped ${encrypted} message(s) stored encrypted at rest — their bodies ` +
          "cannot be read back through the API. Live deliveries are unaffected.",
        );
      }
      return selected;
    },
    /**
     * Verify an `x-mailkite-signature: t=<ms>,v1=<hex>` header over the exact bytes MailKite
     * signed. Mirrors the canonical verifier — `MailKite.verifyWebhook` in the MailKite Node
     * SDK — so there is one algorithm to reason about: `v1` is
     * `HMAC-SHA256(secret, "<t>.<rawBody>")` as lowercase hex, and `t` is milliseconds since
     * the epoch.
     *
     * @param {string} secret - The webhook signing secret (`whsec_…`).
     * @param {string} signatureHeader - Raw `x-mailkite-signature` header value.
     * @param {string} rawBody - The unparsed request body, byte-for-byte as delivered.
     * @param {number} [toleranceMs] - Replay window in ms; `0` disables the freshness check.
     * @returns {boolean} `true` only if the header is well-formed, fresh, and authentic.
     */
    verifySignature(secret, signatureHeader, rawBody, toleranceMs = FRESHNESS_MS) {
      if (typeof signatureHeader !== "string" || !signatureHeader) {
        return false;
      }
      const parts = {};
      for (const seg of signatureHeader.split(",")) {
        const i = seg.indexOf("=");
        if (i !== -1) {
          parts[seg.slice(0, i).trim()] = seg.slice(i + 1).trim();
        }
      }
      const t = Number(parts.t);
      if (!parts.t || !parts.v1 || !Number.isFinite(t)) {
        return false;
      }
      // Freshness: a delivery captured off the wire stops verifying once it is stale, and a
      // timestamp far in the future is equally suspect.
      if (toleranceMs > 0 && Math.abs(Date.now() - t) > toleranceMs) {
        return false;
      }
      const expected = crypto
        .createHmac("sha256", secret)
        .update(`${parts.t}.${rawBody}`)
        .digest("hex");
      // Compare decoded bytes, as the SDK does — invalid hex decodes short and fails on length.
      const a = Buffer.from(expected, "hex");
      const b = Buffer.from(parts.v1, "hex");
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    },
  },
  async run(event) {
    const {
      headers, body, bodyRaw,
    } = event;

    // 1) Acknowledge first so MailKite does not retry.
    if (this.ackMode === "ack") {
      this.http.respond({
        status: 200,
        headers: {
          "content-type": "application/json",
        },
        body: {
          status: "ok",
        },
      });
    } else {
      this.http.respond({
        status: 200,
        body: "ok",
      });
    }

    // 2) Verify the signature over the exact raw body MailKite signed, and only if it is
    // recent (see FRESHNESS_MS) — otherwise a delivery captured once replays forever. The
    // secret persisted at activate() makes this always-on; `webhookSecret` only overrides it
    // (e.g. after rotation).
    //
    // Verification runs over `bodyRaw` only. `JSON.stringify(body)` re-serializes the parsed
    // payload and cannot reproduce the exact bytes MailKite signed (key order, whitespace,
    // number formatting), so an HMAC computed over it can never match.
    //
    // A present-but-invalid signature is still dropped: that is either a spoof or a rotated
    // secret, and emitting it would be wrong. A *missing* `bodyRaw` is different — it means
    // this runtime did not hand us the bytes, not that the delivery is untrustworthy, and
    // dropping there turns a signing detail into "the source never fires". The delivery
    // already arrived on this source's unguessable Pipedream HTTP endpoint, so emit it and
    // say so in the logs. (Zapier's hook transport strips the signature header entirely;
    // this keeps the same failure from being silent here.)
    const secret = this.webhookSecret || this.db.get("signingSecret");
    if (secret) {
      if (bodyRaw == null) {
        console.log(
          "Warning: event.bodyRaw is unavailable, so the x-mailkite-signature could not be " +
          "verified for this delivery — emitting anyway",
        );
      } else if (!this.verifySignature(secret, headers["x-mailkite-signature"], bodyRaw)) {
        console.log("Rejected event: invalid or stale x-mailkite-signature");
        return;
      }
    }

    // 3) Only emit inbound mail.
    if (body?.type !== "email.received") {
      return;
    }

    this.emitEvent(body);
  },
  sampleEmit,
};
