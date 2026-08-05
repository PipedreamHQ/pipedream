// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-log-time-entry",
  name: "Log Time Entry",
  description: "Logs a completed time entry with an explicit start and end time in Clockify — use this to backfill time already tracked elsewhere. Use **Start Timer** instead if you want to start a running timer with no end time yet. [See the documentation](https://docs.clockify.me/#tag/Time-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        clockify,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        clockify,
        "taskId",
        (c) => ({
          workspaceId: c.workspaceId,
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      type: "string",
      label: "User",
      description: "Logs the time entry for this workspace member instead of yourself. Leave blank to log it for your own account.",
      optional: true,
    },
    start: {
      propDefinition: [
        clockify,
        "start",
      ],
      optional: false,
    },
    end: {
      propDefinition: [
        clockify,
        "end",
      ],
      optional: false,
    },
    timeEntryDescription: {
      propDefinition: [
        clockify,
        "timeEntryDescription",
      ],
    },
    billable: {
      propDefinition: [
        clockify,
        "billable",
      ],
    },
    tagIds: {
      propDefinition: [
        clockify,
        "tagIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    timeEntryType: {
      propDefinition: [
        clockify,
        "timeEntryType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createTimeEntry({
      $,
      workspaceId: this.workspaceId,
      userId: this.userId,
      data: {
        start: this.start,
        end: this.end,
        projectId: this.projectId,
        taskId: this.taskId,
        description: this.timeEntryDescription,
        billable: this.billable,
        tagIds: this.tagIds,
        type: this.timeEntryType,
      },
    });

    $.export("$summary", `Successfully logged a time entry with ID ${response.id}`);

    return response;
  },
};
