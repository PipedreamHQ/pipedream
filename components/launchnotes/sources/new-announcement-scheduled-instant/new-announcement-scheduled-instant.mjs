import launchnotes from "../../launchnotes.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "launchnotes-new-announcement-scheduled-instant",
  name: "New Announcement Scheduled",
  description: "Emit new event when an announcement is scheduled. [See the documentation](https://help.launchnotes.com/en/articles/5129003-getting-started-with-the-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    launchnotes: {
      type: "app",
      app: "launchnotes",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    announcementId: {
      propDefinition: [
        launchnotes,
        "announcementId",
      ],
    },
    scheduleTime: {
      propDefinition: [
        launchnotes,
        "scheduleTime",
      ],
    },
    category: {
      propDefinition: [
        launchnotes,
        "category",
      ],
    },
  },
  hooks: {
    async deploy() {
      const events = await this.launchnotes.emitAnnouncementScheduledEvent({
        announcementId: this.announcementId,
        scheduleTime: this.scheduleTime,
        category: this.category,
      });
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        });
      }
    },
    async activate() {
      const webhookId = await this.launchnotes.emitAnnouncementScheduledEvent({
        announcementId: this.announcementId,
        scheduleTime: this.scheduleTime,
        category: this.category,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.launchnotes.emitAnnouncementScheduledEvent({
        announcementId: webhookId,
      });
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.launchnotes.$auth.api_key)
      .update(event.rawBody)
      .digest("base64");

    if (computedSignature !== event.headers["x-launchnotes-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New announcement scheduled: ${event.body.title}`,
      ts: Date.parse(event.body.created_at),
    });
  },
};
