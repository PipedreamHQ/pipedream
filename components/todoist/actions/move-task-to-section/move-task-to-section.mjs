import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-move-task-to-section",
  name: "Move Task To Section",
  description: "Move a Task to a different section within the same project. [See the docs here](https://developer.todoist.com/sync/v9/#move-an-item)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Project containing the task to move",
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "Select a task to move",
    },
    section: {
      propDefinition: [
        todoist,
        "section",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "The section to move the task to",
      optional: false,
    },
  },
  async run ({ $ }) {
    const {
      task,
      section,
    } = this;

    const data = {
      id: task,
      section_id: section,
    };

    const resp = await this.todoist.moveTask({
      $,
      data,
    });
    $.export("$summary", "Successfully moved task");
    return resp;
  },
};
