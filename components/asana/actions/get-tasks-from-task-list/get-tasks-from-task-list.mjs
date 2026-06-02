import asana from "../../asana.app.mjs";

export default {
  key: "asana-get-tasks-from-task-list",
  name: "Get Tasks From Task List",
  description: "Returns the compact list of tasks in the authenticated user's personal My Tasks list. No project is needed — this retrieves the user's own task list automatically. [See the documentation](https://developers.asana.com/reference/gettasksforusertasklist)",
  version: "0.0.13",
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
      description: "The workspace GID to retrieve the user task list from.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
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
      limit: Math.min(this.maxResults, 100),
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana._makeRequest({
        path: `user_task_lists/${taskList.gid}/tasks`,
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
