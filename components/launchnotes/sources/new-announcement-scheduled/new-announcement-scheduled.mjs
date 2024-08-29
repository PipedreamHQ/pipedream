import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "launchnotes-new-announcement-scheduled",
  name: "New Announcement Scheduled",
  description: "Emit new event when an announcement is scheduled.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.launchnotes.listAnnouncements;
    },
    getDateField() {
      return "createdAt";
    },
    getTypes() {
      return "announcements";
    },
    getSummary(item) {
      return `New announcement scheduled: ${item.name}`;
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
          value: "scheduled",
        },
      ];
    },
  },
  sampleEmit,
};
