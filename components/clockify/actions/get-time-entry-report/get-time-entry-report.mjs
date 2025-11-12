import clockify from "../../clockify.app.mjs";

export default {
  name: "Get Time Entry Report",
  description: "Get a time entry report. [See the documentation](https://docs.clockify.me/#tag/Time-Entry-Report/operation/generateDetailedReport)",
  key: "clockify-get-time-entry-report",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    dateRangeStart: {
      type: "string",
      label: "Date Range Start",
      description: "The start date of the date range. Format: YYYY-MM-DDTHH:MM:SS.ssssssZ",
    },
    dateRangeEnd: {
      type: "string",
      label: "Date Range End",
      description: "The end date of the date range. Format: YYYY-MM-DDTHH:MM:SS.ssssssZ",
    },
    clientIds: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      type: "string[]",
      label: "Client IDs",
      description: "Array of client identifiers",
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
    taskIds: {
      propDefinition: [
        clockify,
        "taskId",
        (c) => ({
          workspaceId: c.workspaceId,
          projectId: c.projectId,
        }),
      ],
      type: "string[]",
      label: "Task IDs",
      description: "Array of task identifiers",
      optional: true,
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
    userIds: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clockify.getTimeEntryReport({
      $,
      workspaceId: this.workspaceId,
      data: {
        dateRangeStart: this.dateRangeStart,
        dateRangeEnd: this.dateRangeEnd,
        detailedFilter: {
          options: {
            totals: "CALCULATE",
          },
        },
        clients: this.clientIds
          ? {
            contains: "CONTAINS",
            ids: this.clientIds,
            status: "ALL",
          }
          : undefined,
        projects: this.projectId
          ? {
            contains: "CONTAINS",
            ids: [
              this.projectId,
            ],
            status: "ALL",
          }
          : undefined,
        tasks: this.taskIds
          ? {
            contains: "CONTAINS",
            ids: this.taskIds,
            status: "ALL",
          }
          : undefined,
        tags: this.tagIds
          ? {
            contains: "CONTAINS",
            ids: this.tagIds,
            status: "ALL",
          }
          : undefined,
        users: this.userIds
          ? {
            contains: "CONTAINS",
            ids: this.userIds,
            status: "ALL",
          }
          : undefined,
      },
    });

    $.export("$summary", "Successfully retrieved time entry report");

    return response;
  },
};
