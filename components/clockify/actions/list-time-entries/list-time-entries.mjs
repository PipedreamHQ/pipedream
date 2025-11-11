import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-time-entries",
  name: "List Time Entries",
  description: "List all time entries in a Clockify workspace. [See the documentation](https://docs.clockify.me/#tag/Time-entry/operation/getTimeEntries)",
  version: "0.0.1",
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
      description: "Identifier of a user",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Represents term for searching time entries by description",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Represents start date in yyyy-MM-ddThh:mm:ssZ format. Example: `2020-01-01T00:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "Represents end date in yyyy-MM-ddThh:mm:ssZ format. Example: `2020-01-01T00:00:00Z`",
      optional: true,
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
    projectRequired: {
      type: "boolean",
      label: "Project Required",
      description: "Flag to set whether to only get time entries which have a project",
      optional: true,
    },
    taskRequired: {
      type: "boolean",
      label: "Task Required",
      description: "Flag to set whether to only get time entries which have a task",
      optional: true,
    },
    hydrated: {
      propDefinition: [
        clockify,
        "hydrated",
      ],
    },
    inProgress: {
      type: "boolean",
      label: "In Progress",
      description: "Flag to set whether to filter only in progress time entries",
      optional: true,
    },
    page: {
      propDefinition: [
        clockify,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        clockify,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.listTimeEntries({
      $,
      workspaceId: this.workspaceId,
      userId: this.userId,
      params: {
        "description": this.description,
        "start": this.start,
        "end": this.end,
        "project": this.projectId,
        "task": this.taskId,
        "tags": this.tagIds,
        "project-required": this.projectRequired,
        "task-required": this.taskRequired,
        "hydrated": this.hydrated,
        "in-progress": this.inProgress,
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} time entries`);

    return response;
  },
};
