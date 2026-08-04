// x-pd-ai: optimized
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-tasks",
  name: "List Tasks",
  description: "Lists tasks in your Pipedrive account (BETA). Use **List Projects** to obtain a project ID to filter by. Use the returned IDs with **Get Task**, **Update Task**, or **Delete Task**. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Tasks#getTasks)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Filter tasks by project ID. Run **List Projects** first to obtain a valid project ID.",
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      label: "Assignee ID",
      description: "Filter tasks by assignee (user) ID.",
      optional: true,
    },
    parentTaskId: {
      type: "string",
      label: "Parent Task ID",
      description: "Filter by parent task ID. Omit to return all tasks (default); provide an integer to return only subtasks of that specific task. (Note: the API also accepts `null` to return only root-level tasks, but this prop cannot represent a null value — use a downstream filter step to restrict to root-level tasks.)",
      optional: true,
    },
    isDone: {
      type: "boolean",
      label: "Is Done",
      description: "Filter by completion state (true = done, false = not done).",
      optional: true,
    },
    isMilestone: {
      type: "boolean",
      label: "Is Milestone",
      description: "Filter to only milestone tasks (true) or non-milestone tasks (false).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "For pagination, the number of entries to return. Min 1, max 500 (the API cap). Defaults to 100 if omitted.",
      min: 1,
      max: 500,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "For pagination, the cursor to the next page of results (from additional_data.next_cursor). If omitted, the first page is returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.listTasks({
      $,
      project_id: this.projectId,
      assignee_id: this.assigneeId,
      parent_task_id: this.parentTaskId,
      is_done: this.isDone,
      is_milestone: this.isMilestone,
      limit: this.limit,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} tasks`);
    return response;
  },
};
