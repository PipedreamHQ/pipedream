import common from "../common.mjs";

export default {
  ...common,
  key: "clickup-create-task",
  name: "Create Task",
  description: "Creates a new task. See the docs [here](https://clickup.com/api) in **Tasks / Create Task** section.",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.clickup,
        "list",
        (c) => ({
          folder: c.folder,
          space: c.space,
        }),
      ],
    },
    name: {
      propDefinition: [
        common.props.clickup,
        "name",
      ],
      description: "New task name",
    },
    description: {
      type: "string",
      label: "Description",
      description: "New task description",
      optional: true,
    },
    assignees: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    tags: {
      propDefinition: [
        common.props.clickup,
        "tags",
        (c) => ({
          space: c.space,
        }),
      ],
    },
    status: {
      propDefinition: [
        common.props.clickup,
        "status",
        (c) => ({
          list: c.list,
        }),
      ],
    },
    dueDate: {
      propDefinition: [
        common.props.clickup,
        "dueDate",
      ],
      description:
        `The date by which you must complete the task. Use UTC time in 
        milliseconds (ex. 1508369194377)`,
    },
    dueDateTime: {
      propDefinition: [
        common.props.clickup,
        "dueDateTime",
      ],
      description:
        "Set to true if you want to enable the due date time for the task",
    },
    timeEstimate: {
      type: "integer",
      label: "Time Estimate",
      description: "Use milliseconds",
      optional: true,
    },
    startDate: {
      type: "integer",
      label: "Start Date",
      description:
        "The start date of the task. Use UTC time in milliseconds (ex. 1567780450202)",
      optional: true,
    },
    startDateTime: {
      type: "boolean",
      label: "Start Date Time",
      description: "Select true if you want to enable the start date time",
      optional: true,
    },
    notifyAll: {
      type: "boolean",
      label: "Notify All",
      description:
        `If Notify All is true, creation notifications will be sent to everyone including the 
        creator of the task.`,
      optional: true,
    },
    parent: {
      propDefinition: [
        common.props.clickup,
        "parent",
        (c) => ({
          list: c.list,
        }),
      ],
      optional: true,
    },
    linksTo: {
      propDefinition: [
        common.props.clickup,
        "task",
        (c) => ({
          list: c.list,
        }),
      ],
      label: "Links To",
      description:
        "Accepts a task ID to create a linked dependency on the new task",
      optional: true,
    },
    checkRequiredCustomFields: {
      type: "boolean",
      label: "Check Required Custom Fields",
      description:
        `Indicates whether or not your new task will include data for required 
        Custom Fields (true) or not (false). The default is false. If you set this option to true, 
        and do not include information for required Custom Fields, then you will receive an error 
        that 'One or more required fields is missing'.`,
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: `An array of objects containing 'id' and 'value' keys.
        Example:
        {
          "id": "0a52c486-5f05-403b-b4fd-c512ff05131c",
          "value": 23
        },
      `,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      priority,
      list,
      name,
      description,
      assignees,
      tags,
      status,
      dueDate,
      dueDateTime,
      timeEstimate,
      startDate,
      startDateTime,
      notifyAll,
      parent,
      linksTo,
      checkRequiredCustomFields,
      customFields,
    } = this;
    const data = {
      name,
      description,
      assignees,
      tags,
      status,
      priority,
      due_date: dueDate,
      due_date_time: dueDateTime,
      time_estimate: timeEstimate,
      start_date: startDate,
      start_date_time: startDateTime,
      notify_all: notifyAll,
      parent,
      links_to: linksTo,
      check_required_custom_fields: checkRequiredCustomFields,
      custom_fields: customFields,
    };
    const res = await this.clickup.createTask({
      list,
      data,
      $,
    });
    $.export("$summary", `Successfully created task ${name}`);
    return res;
  },
};
