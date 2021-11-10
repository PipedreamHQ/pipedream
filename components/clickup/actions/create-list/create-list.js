const common = require("../common.js");

module.exports = {
  ...common,
  key: "clickup-create-list",
  name: "Create List",
  description: "Creates a new list",
  version: "0.0.4",
  type: "action",
  props: {
    ...common.props,
    name: {
      propDefinition: [
        common.props.clickup,
        "name",
      ],
      description: "New list name",
    },
    content: {
      type: "string",
      label: "Content",
      description: "New list content",
      optional: true,
    },
    dueDate: {
      propDefinition: [
        common.props.clickup,
        "dueDate",
      ],
      description:
        `The date by which you must complete the tasks in this list. Use [UTC time](https://www.epochconverter.com/) in 
        milliseconds (e.g. \`1508369194377\`)`,
    },
    dueDateTime: {
      propDefinition: [
        common.props.clickup,
        "dueDateTime",
      ],
      description:
        "Set to `true` if you want to enable the due date time for the tasks in this list",
    },
    assignee: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
      type: "string",
      label: "Assignee",
      description: "Assignee to be added to this list",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "The status refers to the List color rather than the task Statuses available in the List",
      optional: true,
    },
  },
  async run() {
    const data = {
      name: this.name,
      content: this.content,
      due_date: this.dueDate,
      due_date_time: this.dueDateTime,
      priority: this.priority,
      assignee: this.assignee,
      status: this.status,
    };
    return this.folder
      ? await this.clickup.createList(this.folder, data)
      : await this.clickup.createFolderlessList(this.space, data);
  },
};
