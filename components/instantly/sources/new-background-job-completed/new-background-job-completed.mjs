import common from "../common/base.mjs";

export default {
  ...common,
  key: "instantly-new-background-job-completed",
  name: "New Background Job Completed",
  description: "Emit new event when a new background job has completed. [See the documentation](https://developer.instantly.ai/api/v2/backgroundjob/listbackgroundjob)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.instantly.listBackgroundJobs;
    },
    getArgs() {
      return {
        params: {
          status: "success,failed",
          sort_column: "updated_at",
          sort_order: "desc",
        },
      };
    },
    getTsField() {
      return "updated_at";
    },
    getSummary(item) {
      return `Background Job Completed with ID: ${item.id}`;
    },
  },
};
