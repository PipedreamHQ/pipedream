import common from "../common/polling.mjs";

export default {
  ...common,
  key: "precisefp-new-form-engagement-completed",
  name: "New Form Engagement Completed",
  description: "Trigger when a new form engagement is completed. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#f35bd385-ccb0-4b02-935e-c8c321f705ff)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "items";
    },
    getResourceFn() {
      return this.app.listFormEngagements;
    },
    getResourceFnArgs() {
      return {
        params: {
          type: "completed",
          sort: "-created_at",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Engagement: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
