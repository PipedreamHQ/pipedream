import jw_player from "../../jw_player.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "jw_player-new-media-available-instant",
  name: "New Media Available Instant",
  description: "Emit new event when a new media conversion is completed or a media becomes available. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    jw_player: {
      type: "app",
      app: "jw_player",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    mediaId: {
      propDefinition: [
        jw_player,
        "mediaId",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.jw_player.createWebhook({
        events: [
          "media_available",
        ],
        webhook_url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.jw_player.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    if (event.headers["x-jw-signature"] !== this.jw_player.$auth.api_secret) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New media available: ${event.body.mediaId}`,
      ts: Date.now(),
    });
  },
};
