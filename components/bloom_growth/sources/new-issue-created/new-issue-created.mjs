import common from "../common/base.mjs";

export default {
  ...common,
  key: "bloom_growth-new-issue-created",
  name: "New Issue Created",
  version: "0.0.3",
  description: "Emit new event when a new issue is created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction(bloomGrowth) {
      return bloomGrowth.listMeetingIssues;
    },
    getSummary(issueId) {
      return `A new issue with id: "${issueId}" was created!`;
    },
  },
};
