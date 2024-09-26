import postmark from "../postmark.app.mjs";

export default {
  props: {
    postmark,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getWebhookProps() {
      return {};
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.postmark.createWebhook({
        data: {
          url: this.http.endpoint,
          ...this.getWebhookProps(),
        },
      });
      this._setHookId(webhook.ID);
    },
    async deactivate() {
      const hookId = this._getHookId();
      return await this.postmark.deleteWebhook(hookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    let dateParam = body.ReceivedAt ?? body.Date ?? Date.now();
    let dateObj = new Date(dateParam);

    let msgId = body.MessageID;
    let id = `${msgId}-${dateObj.toISOString()}`;

    this.$emit(body, {
      id,
      summary: this.getSummary(body),
      ts: dateObj.valueOf(),
    });
  },
};
