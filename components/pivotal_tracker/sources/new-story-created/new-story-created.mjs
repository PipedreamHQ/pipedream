import common from "../common/common-webhook.mjs";

export default {
  ...common,
  name: "New Story Created (Instant)",
  key: "pivotal_tracker-new-story-created",
  description: "Emit new event when a new story is created in a project.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(activity) {
      return {
        id: activity.guid,
        summary: activity.changes[0].name,
        ts: activity.occurred_at,
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (body.kind === "story_create_activity") {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
