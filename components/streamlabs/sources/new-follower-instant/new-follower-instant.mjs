import streamlabs from "../../streamlabs.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "streamlabs-new-follower-instant",
  name: "New Follower",
  description: "Emit a new event when a viewer follows the streamer's channel. [See the documentation]($docsLink)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    streamlabs: {
      type: "app",
      app: "streamlabs",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const followEvents = await this.streamlabs.emitFollowEvent({
        paginate: true,
        max: 50,
      });
      for (const follow of followEvents.reverse()) {
        this.$emit(follow, {
          id: follow.id || follow.ts,
          summary: `New follower: ${follow.username}`,
          ts: follow.timestamp
            ? Date.parse(follow.timestamp)
            : Date.now(),
        });
      }
    },
    async activate() {
      const webhook = await this.streamlabs._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "follow_event",
          callback_url: this.http.url,
        },
      });
      const webhookId = webhook.id;
      if (webhookId) {
        await this.db.set("webhookId", webhookId);
      }
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.streamlabs._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const followEvent = event.data;
    this.$emit(followEvent, {
      id: followEvent.id || followEvent.ts,
      summary: `New follower: ${followEvent.username}`,
      ts: followEvent.timestamp
        ? Date.parse(followEvent.timestamp)
        : Date.now(),
    });
  },
};
