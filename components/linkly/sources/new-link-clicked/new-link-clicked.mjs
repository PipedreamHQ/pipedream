import { createHash } from "crypto";
import linkly from "../../linkly.app.mjs";

export default {
  type: "source",
  key: "linkly-new-link-clicked",
  name: "New Link Clicked (Instant)",
  description: "Emit a new event every time any link in the workspace is clicked, with full click metadata (location, device, browser, referrer). Uses webhooks from the [Linkly URL Shortener API](https://linklyhq.com) for real-time delivery. Note: webhooks require a paid Linkly plan. [See the documentation](https://linklyhq.com/url-shortener-api).",
  version: "0.2.0",
  dedupe: "unique",
  props: {
    linkly,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  hooks: {
    // The Linkly webhook API is keyed by URL: subscribing with a URL returns
    // that same URL as the hook identifier, and unsubscribing accepts the URL
    // as the identifier. So we use `this.http.endpoint` (Pipedream's stable
    // per-source URL) directly on both sides — no need to persist anything.
    async activate() {
      await this.linkly.subscribeWorkspaceWebhook({
        url: this.http.endpoint,
      });
    },
    async deactivate() {
      await this.linkly.unsubscribeWorkspaceWebhook({
        url: this.http.endpoint,
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (!body?.link?.id) {
      return;
    }
    const ts = body.timestamp
      ? new Date(body.timestamp).getTime()
      : Date.now();
    // Compose a stable dedup ID from the link ID + Linkly's ISO timestamp
    // (microsecond precision). If the raw ID exceeds Pipedream's 64-char
    // dedup limit, fold it through sha256.
    const rawId = `${body.link.id}-${body.timestamp ?? ts}`;
    const id = rawId.length > 64
      ? createHash("sha256").update(rawId).digest("hex").slice(0, 64)
      : rawId;
    this.$emit(body, {
      id,
      summary: `Link ${body.link.id} clicked`,
      ts,
    });
  },
};
