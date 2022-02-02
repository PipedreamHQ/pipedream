import common from "../common.mjs";

export default {
  ...common,
  key: "clickup-create-list",
  name: "Create List",
  description: "Creates a new list. See the docs [here](https://clickup.com/api) in either the **Lists / Create List** section or the **Spaces / Create Space** section.",
  version: "0.0.5",
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
  async run({ $ }) {
    const {
      space,
      folder,
      priority,
      name,
      content,
      dueDate,
      dueDateTime,
      assignee,
      status,
    } = this;
    const data = {
      name,
      content,
      due_date: dueDate,
      due_date_time: dueDateTime,
      priority,
      assignee,
      status,
    };
    const res = folder
      ? await this.clickup.createList({
        folder,
        data,
        $,
      })
      : await this.clickup.createFolderlessList({
        space,
        data,
        $,
      });
    $.export("$summary", `Successfully created list ${name}`);
    return res;
  },
};
