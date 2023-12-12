import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-task",
  name: "Update Task",
  description: "Updates a task. [See the docs here](https://developer.todoist.com/rest/v2/#update-a-task)",
  version: "0.0.3",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "The project containing the task to be updated",
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "The task to update",
    },
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
      description: "Task Content",
    },
    description: {
      propDefinition: [
        todoist,
        "description",
      ],
    },
    labels: {
      propDefinition: [
        todoist,
        "labelString",
      ],
    },
    priority: {
      propDefinition: [
        todoist,
        "priority",
      ],
    },
    dueString: {
      propDefinition: [
        todoist,
        "dueString",
      ],
    },
    dueDate: {
      propDefinition: [
        todoist,
        "dueDate",
      ],
    },
    dueDatetime: {
      propDefinition: [
        todoist,
        "dueDatetime",
      ],
    },
    dueLang: {
      propDefinition: [
        todoist,
        "dueLang",
      ],
    },
    assignee: {
      propDefinition: [
        todoist,
        "assignee",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const {
      task,
      content,
      description,
      labels,
      priority,
      dueString,
      dueDate,
      dueDatetime,
      dueLang,
      assignee,
    } = this;
    const data = {
      taskId: task,
      content,
      description,
      labels,
      priority,
      due_string: dueString,
      due_date: dueDate,
      due_datetime: dueDatetime,
      due_lang: dueLang,
      assignee,
    };
    // No interesting data is returned from Todoist
    await this.todoist.updateTask({
      $,
      data,
    });
    $.export("$summary", "Successfully updated task");
    return {
      id: task,
      success: true,
    };
  },
};
