import rocketchat from "../../rocketchat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rocketchat-new-channel-instant",
  name: "New Channel Instant",
  description: "Emit new event when a new channel is created in rocketchat.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    rocketchat: {
      type: "app",
      app: "rocketchat",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        event: "new-channel",
      };
      const result = await this.rocketchat.createRoom(data);
      this.db.set("webhookId", result.webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.rocketchat._makeRequest({
        method: "DELETE",
        path: `/api/v1/integrations.remove?_id=${webhookId}`,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (body.type === "room_created") {
      this.$emit(body, {
        id: body._id,
        summary: `New channel ${body.name} created`,
        ts: Date.now(),
      });
    } else {
      console.log("No relevant event to emit");
    }
  },
};
