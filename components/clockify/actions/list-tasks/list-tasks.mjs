import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-tasks",
  name: "List Tasks",
  description: "List all tasks in a Clockify project. [See the documentation](https://docs.clockify.me/#tag/Task/operation/getTasks)",
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
    projectId: {
      propDefinition: [
        clockify,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "If provided, you'll get a filtered list of tasks that contains the provided string in the task name",
      optional: true,
    },
    strictNameSearch: {
      propDefinition: [
        clockify,
        "strictNameSearch",
      ],
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filters search results whether task is active or not",
      optional: true,
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "The column to sort the tasks by",
      optional: true,
      options: [
        "ID",
        "NAME",
      ],
    },
    sortOrder: {
      propDefinition: [
        clockify,
        "sortOrder",
      ],
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
    const response = await this.clockify.listTasks({
      $,
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      params: {
        "name": this.name,
        "strict-name-search": this.strictNameSearch,
        "is-active": this.isActive,
        "sort-column": this.sortColumn,
        "sort-order": this.sortOrder,
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} tasks in the project`);

    return response;
  },
};
