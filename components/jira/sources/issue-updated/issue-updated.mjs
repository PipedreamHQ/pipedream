import common from "../common/common.mjs";

export default {
  key: "jira-issue-updated",
  name: "New Issue Updated Event (Instant)",
  description: "Emit new event when an issue is updated. Note that Jira supports only one webhook, if more sources are needed please use `New Event` source and select multiple events.",
  version: "0.0.15",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "jira:issue_updated",
      ];
    },
  },
};
