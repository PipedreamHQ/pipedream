import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-updated-highlight-instant",
  name: "Updated Highlight Instant",
  description: "Emit new event when a highlight that matches the filter is updated. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
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
        params: {
          include_highlights: true,
        },
      });
      const highlights = recordings.flatMap((recording) => recording.highlights || []);
      const recentHighlights = highlights.slice(0, 50);

      for (const highlight of recentHighlights) {
        this.$emit(highlight, {
          id: highlight.id,
          summary: `Updated highlight: ${highlight.text}`,
          ts: Date.parse(highlight.created_datetime),
        });
      }
    },
    async activate() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.grain._baseUrl()}/_/public-api/hooks`,
        headers: {
          Authorization: `Bearer ${this.grain.$auth.oauth_access_token}`,
        },
        data: {
          hook_url: this.http.endpoint,
          type: "highlight_updated",
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
    const { body } = event;
    if (body.type === "highlight_updated") {
      this.$emit(body.data, {
        id: body.data.id,
        summary: `Highlight updated: ${body.data.text}`,
        ts: Date.parse(body.data.created_datetime),
      });
    }
  },
};
