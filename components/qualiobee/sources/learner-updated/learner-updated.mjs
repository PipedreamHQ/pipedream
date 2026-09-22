import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "qualiobee-learner-updated",
  name: "Learner Updated",
  description: "Emit new event when a learner is updated in Qualiobee. [See the documentation](https://app.qualiobee.fr/api/doc/#/Learner/PublicLearnerController_getMany)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.qualiobee.listLearners;
    },
    getTsField() {
      return "updateDate";
    },
    generateMeta(learner) {
      const ts = Date.parse(learner.updateDate);
      return {
        id: `${learner.uuid}-${ts}`,
        summary: `Learner Updated with UUID ${learner.uuid}`,
        ts,
      };
    },
  },
};
