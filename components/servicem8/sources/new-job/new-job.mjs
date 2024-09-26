import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Job (Instant)",
  key: "servicem8-new-job",
  description: "Emit new event when a new job is created. By creating this trigger, any other `Job` triggers will stop working as ServiceM8 will replace any previous ones.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMeta({ entry }) {
      if (entry) {
        const {
          uuid, time,
        } = entry[0];

        const eventTime = time || new Date().getTime();

        return {
          id: uuid,
          summary: `New job created with uuid: ${uuid}`,
          ts: eventTime,
        };
      }
    },
    getParams() {
      return {
        object: "Job",
        fields: "uuid",
      };
    },
  },
};
