import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "qualiobee-new-learner-created",
  name: "New Learner Created",
  description: "Emit new event when a new learner is created in Qualiobee. [See the documentation](https://app.qualiobee.fr/api/doc/#/Learner/PublicLearnerController_getMany)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.qualiobee.listLearners;
    },
    generateMeta(learner) {
      return {
        id: learner.uuid,
        summary: `New Learner with UUID ${learner.uuid}`,
        ts: Date.parse(learner.creationDate),
      };
    },
  },
};
