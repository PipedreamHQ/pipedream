// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-search-tasks",
  name: "Search Tasks",
  description:
    "Searches tasks across all task lists by keyword or due date. [See the docs here](https://developers.google.com/workspace/tasks/reference/rest)",
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
    if (!this.keyword && !this.due) {
      throw new Error(
        "Please specify at least one search criterion: Keyword or Due Date.",
      );
    }
    const params = {
      maxResults: this.maxResults,
      showCompleted: this.showCompleted,
      showDeleted: this.showDeleted,
    };

    const taskLists = await this.app.paginate(
      this.app.getTaskLists.bind(this),
      {
        maxResults: this.maxResults,
      },
    );

    const tasks = [];

    for (const taskList of taskLists) {
      const listTasks = await this.app.paginate(
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

    const keyword = this.keyword?.toLowerCase();
    const dueDate = this.due?.split("T")[0];

    const results = tasks.filter((task) => {
      let matches = true;

      if (keyword) {
        const title = task.title?.toLowerCase() ?? "";
        const notes = task.notes?.toLowerCase() ?? "";

        matches =
          matches && (title.includes(keyword) || notes.includes(keyword));
      }

      if (dueDate) {
        matches = matches && task.due?.split("T")[0] === dueDate;
      }

      return matches;
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
