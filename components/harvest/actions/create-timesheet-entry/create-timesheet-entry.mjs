import { ConfigurationError } from "@pipedream/platform";
import harvest from "../../harvest.app.mjs";
import {
  isValidDate, isValidTime, removeNullEntries,
} from "../../common/utils.mjs";

export default {
  key: "harvest-create-timesheet-entry",
  name: "Create Timesheet Entry",
  description: "Create a new time entry. Two ways to log time, matching the account's Company setting: on **duration-based** accounts (`wants_timestamp_timers` is `false` — the common case) set **Hours** to log a completed entry directly. On **timestamp-based** accounts (`wants_timestamp_timers` is `true`) leave **Hours** blank and use **Started Time**/**Ended Time** instead — leave both time fields blank too to start a running timer now, or set both to log a completed entry with explicit start/end times. Passing Started/Ended Time on a duration-based account is silently ignored by Harvest (it starts a running timer instead) — if that happens, switch to **Hours**. Use **Get Projects** to find a Project ID, **List Tasks** to find a Task ID, and **List Users** to find a User ID. Example (duration-based): call with projectId, taskId, spentDate=\"2026-09-17\", hours=3.5. Example (timestamp-based): the same call with hours omitted and startedTime/endedTime set instead. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#create-a-time-entry-via-duration) and [start/end time variant](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#create-a-time-entry-via-start-and-end-time).",
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
    hours: {
      type: "string",
      label: "Hours",
      description: "Duration in hours, e.g. `3.5`. Use this on duration-based accounts (the common case) to log a completed entry in one call. Leave blank if using **Started Time**/**Ended Time** instead.",
      optional: true,
    },
    startedTime: {
      type: "string",
      label: "Started time (H:MM am/pm)",
      description: "Timestamp-based accounts only. The time the entry started, e.g. `8:00am`. Leave this and **Ended Time** blank to start a running timer now instead of logging a completed entry.",
      optional: true,
    },
    endedTime: {
      type: "string",
      label: "Ended time (H:MM am/pm)",
      description: "Timestamp-based accounts only. The time the entry ended, e.g. `5:00pm`. Only used when **Started Time** is also set.",
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

    if (this.hours && (this.startedTime || this.endedTime)) {
      throw new ConfigurationError("Set either Hours (duration-based accounts) or Started/Ended Time (timestamp-based accounts), not both");
    }

    const data = removeNullEntries({
      project_id: this.projectId,
      task_id: this.taskId,
      user_id: this.userId,
      spent_date: this.spentDate,
      hours: this.hours !== undefined && this.hours !== null && this.hours !== ""
        ? Number(this.hours)
        : undefined,
      started_time: this.startedTime?.replace(/\s/g, ""),
      ended_time: this.endedTime?.replace(/\s/g, ""),
    });
    const response = await this.harvest.createTimeEntry({
      $,
      data,
      accountId: this.accountId,
    });
    response && $.export("$summary", "Successfully created time entry");
    return response;
  },
};
