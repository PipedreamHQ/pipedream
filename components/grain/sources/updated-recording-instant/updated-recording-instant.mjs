import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-updated-recording-instant",
  name: "Grain Updated Recording Instant",
  description: "Emit a new event when a recording that matches the filter is updated. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    grain,
    http: {
      type: "$.interface.http",
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const recordings = await this.grain.listRecordings({
        params: {
          sort: "desc",
          limit: 50,
        },
      });

      recordings.forEach((recording) => {
        this.$emit(recording, {
          id: recording.id,
          summary: `Updated recording: ${recording.title}`,
          ts: Date.parse(recording.start_datetime),
        });
      });
    },
    async activate() {
      const response = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: {
          hook_url: this.http.endpoint,
          event_type: "recording_updated",
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.grain._makeRequest({
          method: "DELETE",
          path: `/_/public-api/hooks/${id}`,
        });
      }
    },
  },
  async run(event) {
    if (event.body.type === "recording_updated") {
      const recording = event.body.data;
      this.$emit(recording, {
        id: recording.id,
        summary: `Updated recording: ${recording.title}`,
        ts: Date.parse(recording.start_datetime),
      });
    }
  },
};
