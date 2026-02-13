import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-task",
  name: "Update Task",
  description: "Updates a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/update_task_api_v1_tasks__task_id__post)",
  version: "0.0.5",
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
