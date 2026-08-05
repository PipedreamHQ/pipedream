// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-start-timer",
  name: "Start Timer",
  description: "Starts a running timer for a new time entry in Clockify — no end time is set. Use **Stop Timer** to stop it, or **Update Time Entry** to set an end time later. Use **Log Time Entry** instead if you already know both the start and end time. [See the documentation](https://docs.clockify.me/#tag/Time-entry)",
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
      description: "Starts the timer for this workspace member instead of yourself. Leave blank to start the timer for your own account.",
      optional: true,
    },
    start: {
      propDefinition: [
        clockify,
        "start",
      ],
      description: "Start date and time of the timer, in ISO 8601 format. Example: `2026-08-05T09:00:00Z`. Defaults to the current time if left blank.",
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
        start: this.start || new Date().toISOString(),
        projectId: this.projectId,
        taskId: this.taskId,
        description: this.timeEntryDescription,
        billable: this.billable,
        tagIds: this.tagIds,
        type: this.timeEntryType,
      },
    });

    $.export("$summary", `Successfully started a timer with ID ${response.id}`);

    return response;
  },
};
