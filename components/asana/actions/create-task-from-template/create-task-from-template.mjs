import common from "../common/common.mjs";

export default {
  name: "Create Task from Template",
  key: "asana-create-task-from-template",
  description: "Creates a new task from a task template. [See the documentation](https://developers.asana.com/reference/instantiatetask)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    taskTemplateId: {
      propDefinition: [
        common.props.asana,
        "taskTemplate",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new task. If not provided, the name of the task template will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana.createTaskFromTemplate({
      $,
      taskTemplateId: this.taskTemplateId,
      data: {
        data: {
          name: this.name,
        },
      },
    });
    $.export("$summary", `Successfully created task with ID ${response.data.new_task.gid}`);
    return response;
  },
};
