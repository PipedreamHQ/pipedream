import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-list-tasks",
  name: "List Tasks",
  description: "List tasks from MeisterTask. Supports basic filtering and pagination. [See the docs](https://developers.meistertask.com/reference/get-tasks)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
    assignedToMe: {
      type: "boolean",
      label: "Assigned to Me",
      description: "Return only tasks assigned to the authenticated user",
      optional: true,
    },
    focusedByMe: {
      type: "boolean",
      label: "Focused by Me",
      description: "Return only tasks focused by the authenticated user",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter tasks by status",
      optional: true,
      options: [
        "open",
        "completed",
        "completed_archived",
        "trashed",
      ],
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "Comma-separated list of label IDs to filter tasks",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      assigned_to_me: this.assignedToMe,
      focused_by_me: this.focusedByMe,
      status: this.status,
      labels: this.labels,
    };

    const response = await this.meistertask.listTasks({
      $,
      params,
    });

    const data = response?.data ?? [];

    $.export(
      "$summary",
      `Successfully retrieved ${data.length} tasks`,
    );

    return data;
  },
};
