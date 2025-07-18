import common from "../common/base.mjs";

export default {
  ...common,
  key: "returnless-new-return-created",
  name: "New Return Created (Instant)",
  description: "Emit new event when a return is created. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/fd4ad9c27648b-creates-a-webhook-subscriptions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return.created",
      ];
    },
    getSummary(data) {
      return `New Return Created: ${data.id}`;
    },
  },
};
