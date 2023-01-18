import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Job Queued (Instant)",
  key: "servicem8-job-queued",
  description: "Emit new event when a job is queued. By creating this trigger, any other `Job` triggers will stop working as ServiceM8 will replace any previous ones.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(body) {
      const {
        uuid, time,
      } = body.entry[0];

      const { job_is_scheduled_until_stamp: scheduleTime } = await this.servicem8.getJob(uuid);

      if (scheduleTime != "0000-00-00 00:00:00") {
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
        summary: `New job queued with uuid: ${uuid}`,
        ts: eventTime,
      };
    },
    getParams() {
      return {
        object: "Job",
        fields: "job_is_scheduled_until_stamp",
      };
    },
  },
};
