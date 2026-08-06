// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-search-tasks",
  name: "Search Tasks",
  description:
    "Searches tasks across all task lists using a keyword, due date, or both - at least one of Keyword or Due Date must be provided. Keyword matches against both the task title and notes. Completed and deleted tasks are excluded unless Show Completed / Show Deleted are set. Use this action to find tasks that match specific criteria without modifying them. To create, update, complete, or move tasks, use the **Create Task**, **Update Task**, **Complete Task**, or **Move Task** actions. [See the documentation](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    keyword: {
      propDefinition: [
        app,
        "keyword",
      ],
    },
    due: {
      propDefinition: [
        app,
        "due",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    showCompleted: {
      type: "boolean",
      label: "Show Completed",
      description: "Whether completed tasks are returned in the result.",
      optional: true,
    },
    showDeleted: {
      type: "boolean",
      label: "Show Deleted",
      description: "Whether deleted tasks are returned in the result.",
      optional: true,
    },
  },
  async run({ $ }) {
    const keyword = this.keyword != null
      ? String(this.keyword).trim().toLowerCase()
      : undefined;

    if (!keyword && !this.due) {
      throw new ConfigurationError(
        "Please specify at least one search criterion: Keyword or Due Date.",
      );
    }

    const params = {
      maxResults: this.maxResults,
      showCompleted: this.showCompleted,
      showHidden: this.showCompleted,
      showDeleted: this.showDeleted,
    };

    if (this.due) {
      const due = String(this.due);
      if (Number.isNaN(new Date(due).getTime())) {
        throw new ConfigurationError(
          `Due must be a valid RFC 3339 date, for example \`2026-07-26T00:00:00Z\`. Received: \`${due}\`.`,
        );
      }
      const dueDate = due.split("T")[0];
      params.dueMin = `${dueDate}T00:00:00.000Z`;
      params.dueMax = `${dueDate}T23:59:59.999Z`;
    }

    const taskLists = await this.app.paginate(
      $,
      this.app.getTaskLists.bind(this),
      {
        maxResults: this.maxResults,
      },
    );

    const tasks = [];

    for (const taskList of taskLists) {
      const listTasks = await this.app.paginate(
        $,
        this.app.getTasks.bind(this),
        params,
        taskList.id,
      );

      tasks.push(
        ...listTasks.map((task) => ({
          ...task,
          taskListId: taskList.id,
          taskListTitle: taskList.title,
        })),
      );
    }

    const results = tasks.filter((task) => {
      if (!keyword) {
        return true;
      }

      const title = task.title?.toLowerCase() ?? "";
      const notes = task.notes?.toLowerCase() ?? "";

      return title.includes(keyword) || notes.includes(keyword);
    });

    $.export(
      "$summary",
      `Found ${results.length} matching task${results.length === 1
        ? ""
        : "s"}`,
    );

    return results;
  },
};
