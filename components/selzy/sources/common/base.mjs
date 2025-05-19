import selzy from "../../selzy.app.mjs";

export default {
  props: {
    selzy,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      await this.selzy.createWebhook({
        params: {
          hook_url: this.http.endpoint,
          event_format: "json_post",
          ...this.getEventType(),
          single_event: 1,
          status: "active",
        },
      });
    },
    async deactivate() {
      await this.selzy.deleteWebhook({
        params: {
          hook_url: this.http.endpoint,
        },
      });
    },
  },
  async run({
    body, method,
  }) {
    if (method === "GET") {
      this.http.respond({
        status: 200,
      });
      return true;
    }

    const ts = Date.parse(body.event_time);
    this.$emit(body, {
      id: `${body.campaign_id || body.email}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
