import common from "../common/base.mjs";

export default {
  ...common,
  key: "returnless-return-status-changed",
  name: "Return Status Changed (Instant)",
  description: "Emit new event when a return status is changed. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/fd4ad9c27648b-creates-a-webhook-subscriptions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return.status_changed",
      ];
    },
    getSummary(data) {
      return `Status Changed for Return: ${data.id}`;
    },
  },
};
