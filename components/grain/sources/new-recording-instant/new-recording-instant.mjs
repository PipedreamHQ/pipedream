import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-new-recording-instant",
  name: "New Recording Instant",
  description: "Emit a new event when a recording that matches the filter is added. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
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
        paginate: false,
      });
      const recentRecordings = recordings.slice(-50);
      for (const recording of recentRecordings) {
        this.$emit(recording, {
          id: recording.id,
          summary: `New recording: ${recording.title}`,
          ts: Date.parse(recording.start_datetime),
        });
      }
    },
    async activate() {
      const hookId = await this.grain.createWebhook({
        event: "recording_added",
        url: this.http.endpoint,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.grain.deleteWebhook(id);
    },
  },
  async run(event) {
    if (event.type === "recording_added") {
      const recording = event.data;
      this.$emit(recording, {
        id: recording.id,
        summary: `New recording: ${recording.title}`,
        ts: Date.parse(recording.start_datetime),
      });
    }
  },
};
