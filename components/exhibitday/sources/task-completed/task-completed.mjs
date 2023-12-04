import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "exhibitday-task-completed",
  name: "Task Completed",
  description: "Emit new event when a task is marked as complete in ExhibitDay",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.exhibitday,
        "eventId",
      ],
      description: "Only emit tasks belonging to this event",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.exhibitday.listTasks;
    },
    getArgs() {
      return {
        params: {
          filter_by_completed_only: true,
          filter_by_event_id: this.eventId || undefined,
        },
      };
    },
    getTsField() {
      return "task_completed_timestamp";
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: `Task Completed - ${task.name}`,
        ts: Date.parse(task[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
