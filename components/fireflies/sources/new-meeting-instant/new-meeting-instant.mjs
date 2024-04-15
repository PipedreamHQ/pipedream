import { axios } from "@pipedream/platform";
import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-new-meeting-instant",
  name: "New Meeting Instant",
  description: "Emits an event when a meeting with transcripts is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fireflies: {
      type: "app",
      app: "fireflies",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.fireflies.createWebhook();
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.fireflies.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    if (headers["content-type"] !== "application/json") {
      this.http.respond({
        status: 400,
        body: "Expected application/json",
      });
      return;
    }

    const meeting = JSON.parse(body);

    if (meeting.id !== this.db.get("lastMeetingId")) {
      await this.fireflies.emitNewMeetingEvent(meeting.id);
      this.db.set("lastMeetingId", meeting.id);
    }
  },
};
