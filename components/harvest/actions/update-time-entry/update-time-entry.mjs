import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-update-time-entry",
  name: "Update Time Entry",
  description: "Update an existing time entry. Use **List Time Entries** to find a valid ID. Example: call with timeEntryId set to a logged entry's ID and hours set to a corrected value to fix a mistaken time entry. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#update-a-time-entry).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
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
    timeEntryId: {
      propDefinition: [
        harvest,
        "timeEntryId",
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
    spentDate: {
      type: "string",
      label: "Spent Date",
      description: "Date of the entry, format `YYYY-MM-DD`, e.g. `2026-09-17`.",
      optional: true,
    },
    startedTime: {
      type: "string",
      label: "Started Time",
      description: "Start time, e.g. `8:00am`.",
      optional: true,
    },
    endedTime: {
      type: "string",
      label: "Ended Time",
      description: "End time, e.g. `9:00am`.",
      optional: true,
    },
    hours: {
      type: "string",
      label: "Hours",
      description: "Decimal hours, e.g. `3.5`.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the entry.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.updateTimeEntry({
      $,
      id: this.timeEntryId,
      accountId: this.accountId,
      data: {
        project_id: this.projectId,
        task_id: this.taskId,
        spent_date: this.spentDate,
        started_time: this.startedTime,
        ended_time: this.endedTime,
        hours: this.hours,
        notes: this.notes,
      },
    });
    $.export("$summary", `Successfully updated time entry ${response.id}`);
    return response;
  },
};
