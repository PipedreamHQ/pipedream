import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Job Completed (Instant)",
  key: "servicem8-job-completed",
  description: "Emit new event when a job completes. By creating this trigger, any other `Job` triggers will stop working as ServiceM8 will replace any previous ones.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(body) {
      const {
        uuid, time,
      } = body.entry[0];

      const { status } = await this.servicem8.getJob(uuid);

      if (status === "Completed") {
        const meta = this.getMeta({
          uuid,
          time,
        });
        this.$emit(body, meta);
      }
    },
    getMeta({
      uuid, time,
    }) {
      const eventTime = time || new Date().getTime();

      return {
        id: uuid + time,
        summary: `New job completed with uuid: ${uuid}`,
        ts: eventTime,
      };
    },
    getParams() {
      return {
        object: "Job",
        fields: "status",
      };
    },
  },
};
