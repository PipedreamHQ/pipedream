import common from "../common/common-webhook.mjs";

export default {
  ...common,
  name: "New Activity Performed (Instant)",
  key: "pivotal_tracker-new-activity-performed",
  description: "Emit new event when any activity is performed in a project.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(activity) {
      return {
        id: activity.guid,
        summary: activity.kind,
        ts: activity.occurred_at,
      };
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
