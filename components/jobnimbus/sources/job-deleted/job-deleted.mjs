import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "jobnimbus-job-deleted",
  name: "New Job Deleted Event",
  description: "Emit new events when a job is deleted. [See the docs](https://documenter.getpostman.com/view/3919598/S11PpG4x#62c713fe-5d46-4fd6-9953-db49255fd5e0)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    compareFn(item) {
      return item?.record_type_name == "Job Deleted";
    },
    getMeta(item) {
      return {
        id: item.date_created,
        summary: `Job has been deleted - ID: ${item.primary.id}`,
        ts: item.date_created * 1000,
      };
    },
  },
};
