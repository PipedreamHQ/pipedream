import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created. [See the documentation](https://help.hrcloud.com/api/#/task#GET_tasks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.hrCloud.getTasks;
    },
    getTsField() {
      return "xCreatedOn";
    },
    generateMeta(task) {
      return {
        id: task.Id,
        summary: `New Task: ${task.xSubject}`,
        ts: Date.parse(task[this.getTsField()]),
      };
    },
  },
};
