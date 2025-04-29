import common from "../common/base.mjs";

export default {
  ...common,
  key: "taleez-new-candidate-created",
  name: "New Candidate Created",
  description: "Emit new event when a candidate is added in Taleez. [See the documentation](https://api.taleez.com/swagger-ui/index.html#/candidates/list_4)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.taleez.listCandidates;
    },
    getArgs() {
      return {
        params: {
          withProps: true,
        },
      };
    },
    getTsField() {
      return "dateCreation";
    },
    generateMeta(candidate) {
      return {
        id: candidate.id,
        summary: `New Candidate: ${candidate.firstName} ${candidate.lastName}`,
        ts: candidate.dateCreation,
      };
    },
  },
};
