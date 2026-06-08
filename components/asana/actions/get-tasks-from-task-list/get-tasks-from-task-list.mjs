import asana from "../../asana.app.mjs";

export default {
  key: "asana-get-tasks-from-task-list",
  name: "Get Tasks From Task List",
  description: "Returns tasks from the user's personal **My Tasks** inbox — NOT a project task list. Use this when the user asks for 'my tasks', 'my task list', or 'My Tasks'. Only a workspace GID is needed; no project GID required. [See the documentation](https://developers.asana.com/reference/gettasksforusertasklist)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "The workspace GID to retrieve the user task list from. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional task properties to include in the response (e.g. `created_at`, `due_on`, `custom_fields`). Nested paths are allowed; `gid` is always returned.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { data: taskList } = await this.asana.getUserTaskList({
      userId: "me",
      params: {
        workspace: this.workspace,
      },
      $,
    });

    let hasMore, count = 0;
    const params = {
      opt_fields: Array.isArray(this.optFields) && this.optFields.length
        ? this.optFields.join(",")
        : undefined,
      limit: 100,
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getTasksForUserTaskList({
        userTaskListId: taskList.gid,
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const task of data) {
        results.push(task);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `Successfully retrieved ${results.length} tasks`);
    return results;
  },
};
