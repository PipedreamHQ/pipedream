import launchnotes from "../../launchnotes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "launchnotes-new-announcement-published-instant",
  name: "New Announcement Published",
  description: "Emit new event when an announcement is published. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    launchnotes,
    announcementId: {
      propDefinition: [
        launchnotes,
        "announcementId",
      ],
    },
    announcementType: {
      propDefinition: [
        launchnotes,
        "announcementType",
      ],
      optional: true,
    },
    category: {
      propDefinition: [
        launchnotes,
        "category",
      ],
      optional: true,
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const response = await this.launchnotes.emitAnnouncementPublishedEvent({
        announcementId: this.announcementId,
        announcementType: this.announcementType,
        category: this.category,
      });
      for (const announcement of response) {
        this.$emit(announcement, {
          id: announcement.id,
          summary: `New announcement: ${announcement.title}`,
          ts: Date.parse(announcement.created_at),
        });
      }
    },
    async activate() {
      const webhookId = await this.launchnotes.emitAnnouncementPublishedEvent({
        announcementId: this.announcementId,
        announcementType: this.announcementType,
        category: this.category,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.launchnotes._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const {
      announcementId, announcementType, category,
    } = this;
    try {
      const response = await this.launchnotes.emitAnnouncementPublishedEvent({
        announcementId,
        announcementType,
        category,
      });
      this.$emit(response, {
        id: response.id,
        summary: `New announcement published: ${response.title}`,
        ts: Date.parse(response.published_at),
      });
    } catch (error) {
      console.error("Error emitting announcement published event:", error);
      this.http.respond({
        status: 500,
        body: "Internal Server Error",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
