import common from "../common/common.mjs";

export default {
  key: "jira-issue-deleted",
  name: "New Issue Deleted Event (Instant)",
  description: "Emit new event when an issue is deleted. Note that Jira supports only one webhook, if more sources are needed please use `New Event` source and select multiple events.",
  version: "0.0.13",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "jira:issue_deleted",
      ];
    },
  },
};
