import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-task",
  name: "Create Task",
  description: "Creates a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/create_task_api_v1_tasks_post)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    recurringInfoLabel: {
      type: "alert",
      alertType: "info",
      content: "To create a recurring task, use the `Due String` prop with a value such as `every week`. [See the Todoist documentation on recurring dates](https://www.todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV) for more examples and information.",
    },
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
      description: "Task Content",
      optional: false,
    },
    description: {
      propDefinition: [
        todoist,
        "description",
      ],
    },
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Task project. If not set, task is put to user's Inbox.",
      optional: true,
    },
    section: {
      propDefinition: [
        todoist,
        "section",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "The section to put task into",
      optional: true,
    },
    parent: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
          section: c.section,
        }),
      ],
      label: "Parent",
      description: "Parent task",
      optional: true,
    },
    order: {
      propDefinition: [
        todoist,
        "order",
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
      content,
      description,
      project,
      section,
      parent,
      order,
      labels,
      priority,
      dueString,
      dueDate,
      dueDatetime,
      dueLang,
      assignee,
    } = this;
    const data = {
      content,
      description,
      project_id: project,
      section_id: section,
      parent_id: parent,
      order,
      labels,
      priority,
      due_string: dueString,
      due_date: dueDate,
      due_datetime: dueDatetime,
      due_lang: dueLang,
      assignee_id: assignee,
    };
    const resp = await this.todoist.createTask({
      $,
      data,
    });
    $.export("$summary", "Successfully created task");
    return resp;
  },
};
