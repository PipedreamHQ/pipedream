import common from "../common/base.mjs";

export default {
  ...common,
  key: "agile_crm-new-task",
  name: "New Task",
  description: "Emit new event when a new task is created",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.agileCrm.listTasks.bind(this);
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: task.subject,
        ts: task.created_time,
      };
    },
  },
};
