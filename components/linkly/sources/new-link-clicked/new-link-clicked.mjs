import linkly from "../../linkly.app.mjs";

export default {
  type: "source",
  key: "linkly-new-link-clicked",
  name: "New Link Clicked (Instant)",
  description: "Emit a new event every time any [Linkly](https://linklyhq.com) link in the workspace is clicked, with full click metadata (location, device, browser, referrer). Uses [Linkly's webhooks](https://linklyhq.com/url-shortener-api) for real-time delivery. Note: webhooks require a paid [Linkly plan](https://linklyhq.com/pricing).",
  version: "0.2.0",
  dedupe: "unique",
  props: {
    linkly,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id: hookId } = await this.linkly.subscribeWorkspaceWebhook({
        url: this.http.endpoint,
      });
      this.db.set("hookId", hookId);
    },
    async deactivate() {
      const hookId = this.db.get("hookId") ?? this.http.endpoint;
      await this.linkly.unsubscribeWorkspaceWebhook({
        url: hookId,
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
    this.$emit(body, {
      id: `${body.link.id}-${ts}`,
      summary: `Link ${body.link.id} clicked`,
      ts,
    });
  },
};
