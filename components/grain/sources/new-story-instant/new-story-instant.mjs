import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-new-story-instant",
  name: "New Story Instant",
  description: "Emit a new event when a story that matches the filter is added. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
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
      // No historical data to be retrieved for this webhook
    },
    async activate() {
      const response = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: {
          event: "story_added",
          target_url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.grain._makeRequest({
          method: "DELETE",
          path: `/_/public-api/hooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const {
      type, data,
    } = event.body;
    if (type === "story_added") {
      this.$emit(data, {
        id: data.id,
        summary: `New story added: ${data.title}`,
        ts: Date.parse(data.created_datetime),
      });
    }
  },
};
