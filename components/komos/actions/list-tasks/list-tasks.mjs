import komos from "../../komos.app.mjs";

export default {
  key: "komos-list-tasks",
  name: "List Tasks",
  description: "Return a paginated list of Komos tasks, with optional filtering by name or status. [See the documentation](https://docs.komos.ai/api-reference/tasks/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    komos,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of tasks to return per page. Min 1, max 100. Defaults to 20.",
      optional: true,
      min: 1,
      max: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of tasks to skip for pagination. Defaults to 0.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Filter tasks by name using case-insensitive substring matching.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter tasks by status.",
      optional: true,
      options: [
        "DRAFT",
        "PROCESSING",
        "NEEDS_REVIEW",
        "READY",
        "ERROR",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.komos.listTasks({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
        search: this.search,
        status: this.status,
      },
    });

    const count = response.tasks?.length ?? 0;
    const total = response.total ?? count;
    $.export("$summary", `Retrieved ${count} of ${total} Komos task${total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
