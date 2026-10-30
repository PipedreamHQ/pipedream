import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-site-deleted-instant",
  name: "New Site Deleted (Instant)",
  description: "Emit new event when a site is deleted from the workspace. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,

  },
  methods: {
    ...common.methods,
    getEvent() {
      return "site.deleted";
    },
    getSummary(item) {
      return `Site deleted: ${item.domain}`;
    },
  },
  sampleEmit,
};
