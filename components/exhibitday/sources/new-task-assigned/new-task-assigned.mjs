import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "exhibitday-new-task-assigned",
  name: "New Task Assigned",
  description: "Emit new event when a task is assigned to a user in ExhibitDay.",
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
          filter_by_has_assignee: true,
          filter_by_event_id: this.eventId || undefined,
        },
      };
    },
    getTsField() {
      return "task_last_update_timestamp";
    },
    generateMeta(task) {
      return {
        id: `${task.id}${task.assignee.id}`,
        summary: `Task Assigned - ${task.name}`,
        ts: Date.parse(task[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
