import { ConfigurationError } from "@pipedream/platform";
import harvest from "../../harvest.app.mjs";
import {
  isValidDate, isValidTime, removeNullEntries,
} from "../../common/utils.mjs";

export default {
  key: "harvest-create-timesheet-entry",
  name: "Create Timesheet Entry",
  description: "Create a new time entry. Leave **Started Time** and **Ended Time** blank to start a running timer now; set both to log a completed entry with explicit start/end times. Use **Get Projects** to find a Project ID, **List Tasks** to find a Task ID, and **List Users** to find a User ID. Example: call with projectId, taskId set to Fence Maintenance's task ID, spentDate=\"2026-09-17\", and both time fields blank to start a running timer now. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#create-a-time-entry-via-start-and-end-time).",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
      ],
    },
    spentDate: {
      type: "string",
      label: "Spent date (YYYY-MM-DD)",
      description: "The ISO 8601 formatted date on which the time entry was spent, e.g. `2019-07-26`.",
    },
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
    },
    startedTime: {
      type: "string",
      label: "Started time (H:MM am/pm)",
      description: "The time the entry started, e.g. `8:00am`. Leave this and **Ended Time** blank to start a running timer now instead of logging a completed entry.",
      optional: true,
    },
    endedTime: {
      type: "string",
      label: "Ended time (H:MM am/pm)",
      description: "The time the entry ended, e.g. `5:00pm`. Only used when **Started Time** is also set.",
      optional: true,
    },
  },
  async run({ $ }) {

    if (this.spentDate && !isValidDate(this.spentDate)) {
      throw new ConfigurationError("Invalid spent date. Ensure format is YYYY-MM-DD");
    }

    if (this.startedTime && !isValidTime(this.startedTime)) {
      throw new ConfigurationError("Invalid start time. Ensure format is (H:MM am/pm)");
    }

    if (this.endedTime && !isValidTime(this.endedTime)) {
      throw new ConfigurationError("Invalid end time. Ensure format is (H:MM am/pm)");
    }

    if (this.endedTime && !this.startedTime) {
      throw new ConfigurationError("Started Time is required when Ended Time is set");
    }

    const params = removeNullEntries({
      project_id: this.projectId,
      task_id: this.taskId,
      user_id: this.userId,
      spent_date: this.spentDate,
      started_time: this.startedTime?.replace(/\s/g, ""),
      ended_time: this.endedTime?.replace(/\s/g, ""),
    });
    const response = await this.harvest.createTimeEntry({
      $,
      params,
      accountId: this.accountId,
    });
    response && $.export("$summary", "Successfully created time entry");
    return response;
  },
};
