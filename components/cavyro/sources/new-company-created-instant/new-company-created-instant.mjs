import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cavyro-new-company-created-instant",
  name: "New Company Created (Instant)",
  description: "Emit new event when a company is created in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "company.created",
      ];
    },
    getSummary({ data }) {
      return `New company: ${data.name}`;
    },
  },
  sampleEmit,
};
