import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-removed-highlight-instant",
  name: "Highlight Removed Instant",
  description: "Emit new event when a highlight that matches the filter is removed. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
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
      const highlights = await this.grain.listRecordings({
        include_highlights: true,
      });
      const recentHighlights = highlights.slice(-50).filter((recording) => recording.highlights && recording.highlights.length > 0);
      for (const highlight of recentHighlights.flatMap((recording) => recording.highlights)) {
        this.$emit(highlight, {
          id: highlight.id,
          summary: `Removed highlight with ID: ${highlight.id}`,
          ts: Date.parse(highlight.created_datetime),
        });
      }
    },
    async activate() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.grain._baseUrl()}/_/public-api/hooks`,
        data: {
          hook_url: this.http.endpoint,
          events: [
            "highlight_removed",
          ],
        },
        headers: {
          Authorization: `Bearer ${this.grain.$auth.oauth_access_token}`,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.grain._baseUrl()}/_/public-api/hooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.grain.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const {
      type, data,
    } = event.body;
    if (type === "highlight_removed") {
      this.$emit(data, {
        id: data.id,
        summary: `Highlight removed from recording ${data.recording_id}`,
        ts: Date.now(),
      });
    }
  },
};
