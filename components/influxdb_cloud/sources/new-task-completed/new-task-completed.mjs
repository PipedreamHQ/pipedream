import common from "../common/base.mjs";

export default {
  ...common,
  key: "influxdb_cloud-new-task-completed",
  name: "New Task Completed",
  description: "Emit new event when a new task is completed. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/GetTasks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.influxDbCloud.listTasks;
    },
    getResourceKey() {
      return "tasks";
    },
    getTsField() {
      return "latestCompleted";
    },
    getSummary(item) {
      return `Task ${item.name} Completed`;
    },
  },
};
