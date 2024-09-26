import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_classroom-new-announcement",
  name: "New Announcement",
  description: "Emit new event when an announcement is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents({ pageSize }) {
      const { announcements } = await this.googleClassroom.listAnnouncements({
        ...this.getParams(),
        pageSize,
      });
      return announcements || [];
    },
    async getResults(after) {
      return this.paginate(this.googleClassroom.listAnnouncements, this.getParams(), "announcements", after);
    },
    getParams() {
      return {
        courseId: this.course,
      };
    },
    isRelevant(announcement, after = null) {
      return this.isAfter(announcement.creationTime, after);
    },
    generateMeta(announcement) {
      return {
        id: announcement.id,
        summary: `New announcement ID ${announcement.id}`,
        ts: Date.parse(announcement.creationTime),
      };
    },
  },
  sampleEmit,
};
