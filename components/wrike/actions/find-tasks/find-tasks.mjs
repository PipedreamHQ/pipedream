import wrike from "../../wrike.app.mjs";
import {
  TASK_STATUS_OPTIONS, TASK_IMPORTANCE_OPTIONS, DEFAULT_LIMIT, MAX_LIMIT,
} from "../../common/constants.mjs";
import { stringifyJson } from "../../common/utils.mjs";

export default {
  key: "wrike-find-tasks",
  name: "Find Tasks",
  description: "Query tasks within a Wrike folder or project via GET /folders/{folderId}/tasks, with optional status, due-date, importance, and assignee filters. Answers questions like 'what's overdue in the Marketing project?'. Use **List Folder ID Options** to obtain a folderId. Use the returned task IDs with **Get Task** or **Update Task**. [See the documentation](https://developers.wrike.com/reference/getfolderssingletasks)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    folderId: {
      propDefinition: [
        wrike,
        "folderId",
      ],
      description: "The ID of the folder or project whose tasks to query, e.g. `IEAASDF3`. Run the **List Folder ID Options** action to look up folder IDs.",
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by task status. One or more of: `Active`, `Deferred`, `Completed`, `Cancelled`.",
      optional: true,
      options: TASK_STATUS_OPTIONS,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "Filter by task importance. One of: `High`, `Normal`, `Low`.",
      optional: true,
      options: TASK_IMPORTANCE_OPTIONS,
    },
    dueDateGt: {
      type: "string",
      label: "Due Date From",
      description: "Return tasks due on or after this date (maps to dueDate.start). Format `yyyy-MM-dd`, e.g. `2026-07-01`.",
      optional: true,
    },
    dueDateLt: {
      type: "string",
      label: "Due Date To",
      description: "Return tasks due on or before this date (maps to dueDate.end). Format `yyyy-MM-dd`, e.g. `2026-08-01`.",
      optional: true,
    },
    responsibles: {
      propDefinition: [
        wrike,
        "contactId",
      ],
      type: "string[]",
      label: "Responsibles",
      description: "Filter by assignee contact IDs, e.g. `KUABCDEF`. Run the **List Contact ID Options** action to look up contact IDs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of tasks to return. Min 1, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT}.`,
      optional: true,
      min: 1,
      max: MAX_LIMIT,
    },
  },
  async run({ $ }) {
    const params = {
      status: stringifyJson(this.status),
      importance: this.importance,
      dueDate: (this.dueDateGt || this.dueDateLt)
        ? stringifyJson({
          start: this.dueDateGt,
          end: this.dueDateLt,
        })
        : undefined,
      responsibles: stringifyJson(this.responsibles),
      limit: this.limit ?? DEFAULT_LIMIT,
    };

    const tasks = await this.wrike.listTasks({
      $,
      folderId: this.folderId,
      params,
    });

    $.export("$summary", `Found ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"} in folder ${this.folderId}`);
    return tasks;
  },
};
