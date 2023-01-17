import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Task Created",
  key: "roll-new-task",
  description: "Emit new event when a task is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spondyr API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getFieldId() {
      return "TaskId";
    },
    getFieldResponse() {
      return "task";
    },
    getFn() {
      return this.roll.listTasks;
    },
    getDataToEmit({
      TaskId,
      Created,
    }) {
      const dateTime = Created || new Date().getTime();
      return {
        id: TaskId,
        summary: `New task with TaskId ${TaskId} was successfully created!`,
        ts: dateTime,
      };
    },
  },
};

