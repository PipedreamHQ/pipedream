import mailkite from "../../mailkite.app.mjs";
import {
  BACKFILL_LIMIT,
  BACKFILL_MAX_PAGES,
  BACKFILL_PAGE_SIZE,
} from "../../common/constants.mjs";
import { verifySignature } from "../../common/utils.mjs";
import { toEmailReceivedEvent } from "../../common/message-to-event.mjs";
import sampleEmit from "./test-event.mjs";

// Re-exported for the unit tests and for callers that import the source module directly.
export {
  BACKFILL_LIMIT,
  BACKFILL_MAX_PAGES,
  BACKFILL_PAGE_SIZE,
  FRESHNESS_MS,
} from "../../common/constants.mjs";

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
        "secret (e.g. it was rotated in the MailKite dashboard → **Webhooks**), e.g. `whsec_…`.",
      optional: true,
    },
    ackMode: {
      type: "string",
      label: "Acknowledgement Response",
      description:
        "How this source answers MailKite. `lenient` (default) returns a plain 2xx body; `ack` returns `{\"status\":\"ok\"}`, the confirmation a domain whose webhook route is in **ack** mode requires, e.g. `ack`.",
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
      // Only record a *foreign* route as the incumbent. A repeated activate() sees this
      // source's own endpoint already installed; treating that as the incumbent would later
      // "restore" a Pipedream endpoint that no longer exists.
      if (incumbent?.webhookUrl !== this.http.endpoint) {
        this._setIncumbentWebhook(
          incumbent?.webhookUrl
            ? { url: incumbent.webhookUrl }
            : null,
        );
      }

      const { webhookUrl, signingSecret } = await this.mailkite.setWebhook({
        domainId: this.domainId,
        data: {
          url: this.http.endpoint,
        },
      });
      this._setWebhookUrl(webhookUrl);
      // Persist the secret MailKite just handed us so verification is on by default; the
      // `webhookSecret` prop remains only as an override (see run()).
      this._setSigningSecret(signingSecret);
    },
    async deactivate() {
      const registeredUrl = this._getWebhookUrl();
      if (!registeredUrl) {
        // activate() never completed its PUT, so this source does not own the route. Touching
        // it here could delete another integration's webhook.
        console.log(
          "Skipping webhook cleanup: this source never registered a webhook route",
        );
        return;
      }

      // Only clean up a route that still belongs to this source. If someone else took the
      // domain's catch-all over after us, restoring or deleting would clobber their wiring.
      let currentUrl;
      try {
        const domain = await this.mailkite.getDomain({
          domainId: this.domainId,
        });
        currentUrl = domain?.webhookUrl;
      } catch (err) {
        // A 4xx means the domain (and so its route) is gone or not ours — retrying will not
        // change that, so log and leave it. A timeout, a 429, or a 5xx is transient: rethrow so
        // Pipedream fails the deactivation and retries it, instead of reporting success while
        // the route still points at this source.
        const status = err?.response?.status ?? err?.status;
        const retryable = !status || status === 429 || status >= 500;
        if (retryable) throw err;
        console.log(
          `Skipping webhook cleanup: could not read the domain's current route — ${err.message}`,
        );
        return;
      }
      if (currentUrl !== registeredUrl) {
        console.log(
          "Skipping webhook cleanup: the domain's webhook route no longer points at this source",
        );
        return;
      }

      const incumbent = this._getIncumbentWebhook();
      if (incumbent?.url) {
        await this.mailkite.setWebhook({
          domainId: this.domainId,
          data: {
            url: incumbent.url,
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
    _getIncumbentWebhook() {
      return this.db.get("incumbentWebhook");
    },
    _setIncumbentWebhook(value) {
      this.db.set("incumbentWebhook", value);
    },
    _getWebhookUrl() {
      return this.db.get("webhookUrl");
    },
    _setWebhookUrl(value) {
      this.db.set("webhookUrl", value);
    },
    _getSigningSecret() {
      return this.db.get("signingSecret");
    },
    _setSigningSecret(value) {
      this.db.set("signingSecret", value);
    },
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
     * The endpoint has no domain filter and no direction filter, so without `search` it returns
     * the account's outbound sends and every other domain's mail too — pages that can fill up
     * with mail this source will never emit. `search` is the one server-side filter it does
     * offer (a substring over sender, recipient, and subject), so the domain suffix narrows
     * each page before it is paged; the exact `endsWith` check below still runs, because a
     * substring also matches lookalikes (`@myapp.ai.example`). Rows whose bodies are encrypted
     * at rest (`enc_key_fp`) are stored as ciphertext the API never decrypts, so backfilling
     * one would emit an event whose `text`/`html` are unreadable — those are skipped and
     * counted in the log instead.
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
          search: suffix,
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
        // `before` is exclusive, so paging on the last row's own timestamp would drop any row
        // sharing that millisecond; `+ 1` keeps them and `seen` absorbs the re-read overlap.
        // `search` already removes the common way a page goes stale (other domains' mail), so a
        // full page that is *entirely* overlap means >200 messages for this domain share one
        // `received_at`. The API's only cursor is `received_at <`, which cannot move within a
        // bucket, so step strictly below it to reach older mail rather than stopping here, and
        // say in the log that the rest of that bucket could not be read. A short page ends the
        // list.
        if (rows.length < BACKFILL_PAGE_SIZE) break;
        const oldest = rows[rows.length - 1].received_at;
        if (!fresh) {
          const next = oldest;
          if (next === before) break; // the API ignored the cursor — no progress possible
          console.log(
            "Backfill skipped the remainder of a >1-page timestamp bucket at " +
            `${oldest} — those messages cannot be paged to with a received_at cursor.`,
          );
          before = next;
          continue;
        }
        before = oldest + 1;
      }
      if (encrypted) {
        console.log(
          `Backfill skipped ${encrypted} message(s) stored encrypted at rest — their bodies ` +
          "cannot be read back through the API. Live deliveries are unaffected.",
        );
      }
      return selected;
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
    // Every failure is dropped: a present-but-invalid signature is a spoof or a rotated
    // secret; a missing secret or `bodyRaw` means verification is impossible, so emitting
    // would bypass the signature entirely. The request is acknowledged above either way, so
    // MailKite stops retrying.
    const secret = this.webhookSecret || this._getSigningSecret();
    if (!secret) {
      console.log(
        "Rejected event: no webhook signing secret is available, so the x-mailkite-signature cannot be verified",
      );
      return;
    }
    if (bodyRaw == null) {
      console.log(
        "Rejected event: event.bodyRaw is unavailable, so the x-mailkite-signature cannot be verified",
      );
      return;
    }
    if (!verifySignature(secret, headers["x-mailkite-signature"], bodyRaw)) {
      console.log("Rejected event: invalid or stale x-mailkite-signature");
      return;
    }

    // 3) Only emit inbound mail.
    if (body?.type !== "email.received") {
      return;
    }

    this.emitEvent(body);
  },
  sampleEmit,
};
