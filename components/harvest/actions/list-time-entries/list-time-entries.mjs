import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-time-entries",
  name: "List Time Entries",
  description: `Retrieve a list of time entries from Harvest, with optional filters, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} entries. Use this to discover time entry IDs for **Get Time Entry**, **Update Time Entry**, or **Delete Time Entry**. Example: call with projectId set to a project's ID and from/to set to a date range to total up hours logged that week. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#list-all-time-entries).`,
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
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
    },
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
      ],
      optional: true,
    },
    isBilled: {
      type: "boolean",
      label: "Is Billed",
      description: "Only return entries that have or have not been invoiced.",
      optional: true,
    },
    isRunning: {
      type: "boolean",
      label: "Is Running",
      description: "Only return running or non-running entries.",
      optional: true,
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "Only return entries with a spent_date on or after this date, format `YYYY-MM-DD`, e.g. `2026-09-01`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Only return entries with a spent_date on or before this date, format `YYYY-MM-DD`, e.g. `2026-09-10`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const entries = [];
    const pages = this.harvest.listTimeEntriesPaginated({
      page: 1,
      $,
      accountId: this.accountId,
      user_id: this.userId,
      client_id: this.clientId,
      project_id: this.projectId,
      task_id: this.taskId,
      is_billed: this.isBilled,
      is_running: this.isRunning,
      updated_since: this.updatedSince,
      from: this.from,
      to: this.to,
    });
    for await (const entry of pages) {
      entries.push(entry);
      if (entries.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = entries.length;
    $.export("$summary", `Successfully retrieved ${count} time entr${count === 1
      ? "y"
      : "ies"}`);
    return entries;
  },
};
