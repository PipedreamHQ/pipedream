import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "firefish-new-candidate-created",
  name: "New Candidate Created",
  description: "Emit new event when a new candidate is created. [See the documentation](https://developer.firefishsoftware.com/#0dc51713-8397-4aaa-a85e-a66eb8f94d9d)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.firefish.searchCandidates;
    },
    generateMeta(candidate) {
      return {
        id: candidate.Ref,
        summary: `New Candidate ID: ${candidate.Ref}`,
        ts: Date.parse(candidate.Created),
      };
    },
  },
  sampleEmit,
};
