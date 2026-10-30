import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-site-instant",
  name: "New Site (Instant)",
  description: "Emit new event when a site is added to the workspace. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,

  },
  methods: {
    ...common.methods,
    getEvent() {
      return "site.created";
    },
    getSummary(item) {
      return `New site: ${item.domain}`;
    },
  },
  sampleEmit,
};
