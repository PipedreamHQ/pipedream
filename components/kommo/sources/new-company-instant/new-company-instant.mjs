import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kommo-new-company-instant",
  name: "New Company (Instant)",
  description: "Emit new event when a company is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "add_company",
      ];
    },
    getSummary(body) {
      return `New Company: ${body["contacts[add][0][name]"]}`;
    },
  },
  sampleEmit,
};
