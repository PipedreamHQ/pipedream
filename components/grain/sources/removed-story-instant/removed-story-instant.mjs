import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-removed-story-instant",
  name: "Removed Story Instant",
  description: "Emit new event when a story that matches the filter is removed. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    grain,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch
    },
    async activate() {
      const response = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: {
          event_type: "story_removed",
          hook_url: this.http.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.grain._makeRequest({
          method: "DELETE",
          path: `/_/public-api/hooks/${webhookId}`,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  async run(event) {
    const { data } = event.body;
    this.$emit(data, {
      id: data.id,
      summary: `Story removed: ${data.id}`,
      ts: Date.now(),
    });
  },
};
