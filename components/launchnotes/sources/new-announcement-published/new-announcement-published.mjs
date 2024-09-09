import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "launchnotes-new-announcement-published",
  name: "New Announcement Published",
  description: "Emit new event when an announcement is published.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.launchnotes.listAnnouncements;
    },
    getDateField() {
      return "publishedAt";
    },
    getTypes() {
      return "announcements";
    },
    getSummary(item) {
      return `New announcement published: ${item.name}`;
    },
    getRules(lastDate) {
      return [
        {
          field: this.getDateField(),
          expression: "gt",
          value: lastDate,
        },
        {
          field: "state",
          expression: "eq",
          value: "published",
        },
      ];
    },
  },
  sampleEmit,
};
