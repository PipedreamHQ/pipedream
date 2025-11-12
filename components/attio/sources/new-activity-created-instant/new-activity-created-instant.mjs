import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-new-activity-created-instant",
  name: "New Activity Created (Instant)",
  description: "Emit new event when a note, task, or comment is created, useful for tracking engagement in real time.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        {
          event_type: "comment.created",
          filter: null,
        },
        {
          event_type: "note.created",
          filter: null,
        },
        {
          event_type: "task.created",
          filter: null,
        },
      ];
    },
    generateMeta(record) {
      return {
        id: record.id.task_id || record.id.note_id || record.id.comment_id,
        summary: `New Activity with ID: ${record.id.task_id || record.id.note_id || record.id.comment_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
