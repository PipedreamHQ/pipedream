import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Person Created",
  key: "pipeline-new-person-created",
  description: "Emit new event when a new person is created in your Pipeline account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipeline.listPeople;
    },
    generateMeta(person) {
      return {
        id: person.id,
        summary: person.full_name,
        ts: Date.parse(person.created_at),
      };
    },
  },
};
