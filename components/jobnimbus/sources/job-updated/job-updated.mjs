import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "jobnimbus-job-updated",
  name: "New Job Updated Event",
  description: "Emit new events when a job is updated. [See the docs](https://documenter.getpostman.com/view/3919598/S11PpG4x#62c713fe-5d46-4fd6-9953-db49255fd5e0)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    compareFn(item) {
      return item?.record_type_name == "Job Modified";
    },
    async getItem(item) {
      return this.app.getJob({
        jobId: item.primary.id,
      });
    },
    getMeta(item) {
      return {
        id: item.date_updated,
        summary: `Job has been updated - ID: ${item.jnid}`,
        ts: item.date_updated * 1000,
      };
    },
  },
};
