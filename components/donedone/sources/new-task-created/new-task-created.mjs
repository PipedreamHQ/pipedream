import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "donedone-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created. [See the documentation](https://app.swaggerhub.com/apis-docs/DoneDone/DoneDone-2-Public-API/1.0.0-oas3#/Tasks/get__account_id__tasks_search)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.donedone.listTasks;
    },
    getResourceKey() {
      return "listTasks";
    },
    getPaginationKey() {
      return "totalTaskCount";
    },
    getSummary(item) {
      return `New Task Created: ${item.title}`;
    },
  },
};
