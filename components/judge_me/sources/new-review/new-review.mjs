import app from "../../judge_me.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  name: "New Review (Instant)",
  description: "Emit new event when a new review is posted. [See the documentation](https://judge.me/api/docs#tag/Webhooks/operation/webhooks#create)",
  type: "source",
  key: "judge_me-new-review",
  version: "0.0.1",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookData() {
      return JSON.parse(this.db.get("webhook"));
    },
    _setWebhookData(data) {
      this.db.set("webhook", JSON.stringify(data));
    },
  },
  hooks: {
    async activate() {
      const webhook = {
        key: "review/created",
        url: this.http.endpoint,
      };
      await this.app.createWebhook({
        data: {
          webhook,
        },
      });
      this._setWebhookData(webhook);
    },
    async deactivate() {
      const webhook = this._getWebhookData();
      await this.app.removeWebhook({
        data: webhook,
      });
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.review.id,
      summary: `New review: ${body.review.title}`,
      ts: new Date(body.review.created_at),
    });
  },
  sampleEmit,
};
