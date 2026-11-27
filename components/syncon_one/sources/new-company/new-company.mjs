import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-company",
  name: "New Company",
  description: "Emit new event when a company is added in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.created";
    },
    getPath() {
      return "/companies";
    },
    getObjectType() {
      return "company";
    },
    getSummary() {
      return "New Company";
    },
  },
};
