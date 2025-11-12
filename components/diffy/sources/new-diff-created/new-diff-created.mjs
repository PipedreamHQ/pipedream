import common from "../common/base.mjs";

export default {
  ...common,
  key: "diffy-new-diff-created",
  name: "New Diff Created",
  description: "Emit new event when a new diff is created in Diffy. [See the documentation](https://app.diffy.website/rest#/Projects/get_projects__id__diffs)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.diffy.listDiffs;
    },
    getArgs() {
      return {
        projectId: this.projectId,
      };
    },
    getResourceType() {
      return "diffs";
    },
    getTsField() {
      return "timestamp";
    },
    generateMeta(diff) {
      return {
        id: diff.id,
        summary: `New diff ${diff.id}`,
        ts: diff.timestamp,
      };
    },
  },
};
