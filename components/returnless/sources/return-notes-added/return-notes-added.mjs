import common from "../common/base.mjs";

export default {
  ...common,
  key: "returnless-return-notes-added",
  name: "Return Notes Added (Instant)",
  description: "Emit new event when a return note is added. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/fd4ad9c27648b-creates-a-webhook-subscriptions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return.notes.added",
      ];
    },
    getSummary(data) {
      return `Return Notes Added to Return: ${data.id}`;
    },
  },
};
