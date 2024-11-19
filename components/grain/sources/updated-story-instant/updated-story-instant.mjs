import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-updated-story-instant",
  name: "Updated Story Instant",
  description: "Emit new event when a story that matches the filter is updated. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    grain,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit historical events
      const stories = await this.grain.listRecordings({
        max: 50,
        sort: "last_edited_datetime",
      });
      for (const story of stories) {
        this.$emit(story, {
          id: story.id,
          summary: `Historical event: Updated story ${story.title}`,
          ts: Date.parse(story.last_edited_datetime),
        });
      }
    },
    async activate() {
      // Create a webhook subscription
      const response = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: {
          eventTypes: [
            "story_updated",
          ],
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      // Remove the webhook subscription
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
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  async run(event) {
    const {
      type, data,
    } = event.body;
    if (type === "story_updated") {
      this.$emit(data, {
        id: data.id,
        summary: `Story Updated: ${data.title}`,
        ts: Date.parse(data.last_edited_datetime),
      });
    }
    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
