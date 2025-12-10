import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "remote-new-contract-amendment-done-instant",
  name: "New Contract Amendment Done (Instant)",
  description: "Emit new event when a contract amendment is done. [See the documentation](https://developer.remote.com/reference/contract_amendmentdone)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "contract_amendment.done",
      ];
    },
    generateMeta({
      body,
      ts,
    }) {
      return {
        id: body.employment_id,
        summary: `Contract amendment for employment with ID ${body.employment_id} has been done`,
        ts,
      };
    },
  },
  sampleEmit,
};
