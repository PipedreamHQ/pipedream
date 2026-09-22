import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-tasks",
  name: "List Tasks",
  description: `List tasks in the Harvest account, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} tasks. Use this to discover task IDs for **Create Task Assignment**, **Create Timesheet Entry**, and other tools that accept a Task ID. Example: call with isActive=true to find the ID for the "Fence Maintenance" task before assigning it to a project. [See the documentation](https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/#list-all-tasks).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Only return active or inactive tasks.",
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
  },
  async run({ $ }) {
    const tasks = [];
    const pages = this.harvest.listTasksPaginated({
      page: 1,
      $,
      accountId: this.accountId,
      isActive: this.isActive,
      updatedSince: this.updatedSince,
    });
    for await (const task of pages) {
      tasks.push(task);
      if (tasks.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = tasks.length;
    $.export("$summary", `Successfully retrieved ${count} task${count === 1
      ? ""
      : "s"}`);
    return tasks;
  },
};
