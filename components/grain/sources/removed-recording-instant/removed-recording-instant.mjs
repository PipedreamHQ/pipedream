import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-removed-recording-instant",
  name: "Removed Recording Instant",
  description: "Emit a new event when a recording matching the filter is removed. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
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
      const recordings = await this.grain.listRecordings({
        paginate: true,
        max: 50,
      });
      for (const recording of recordings) {
        this.$emit(recording, {
          id: recording.id,
          summary: `Recording removed: ${recording.title}`,
          ts: Date.parse(recording.start_datetime),
        });
      }
    },
    async activate() {
      const webhookConfig = {
        type: "removed",
        hook_url: this.http.endpoint,
      };
      const webhookId = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: webhookConfig,
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.grain._makeRequest({
        method: "DELETE",
        path: `/_/public-api/hooks/${id}`,
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  async run(event) {
    const {
      type, data,
    } = event.body;
    if (type === "removed") {
      this.$emit(data, {
        id: data.id,
        summary: `Recording removed: ${data.id}`,
        ts: Date.now(),
      });
    }
  },
};
