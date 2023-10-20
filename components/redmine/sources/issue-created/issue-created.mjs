import common from "../common/polling.mjs";

export default {
  ...common,
  key: "redmine-issue-created",
  name: "New Issue Created",
  description: "Emit new event when a new issue is created in Redmine",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "issues";
    },
    getResourceFn() {
      return this.app.listIssues;
    },
    getResourceFnArgs() {
      return {
        params: {
          sort: "created_on:desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Issue: ${resource.subject}`,
        ts: Date.parse(resource.created_on),
      };
    },
  },
};
