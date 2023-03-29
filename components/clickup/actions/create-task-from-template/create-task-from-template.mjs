import clickup from "../../clickup.app.mjs";
import common from "../common/list-props.mjs";

export default {
  key: "clickup-create-task-from-template",
  name: "Create Task From Template",
  description: "Creates a new task from a template. See the docs [here](https://clickup.com/api) in **Task Templates / Create Task From Template** section.",
  version: "0.0.6",
  type: "action",
  props: {
    ...common.props,
    taskTemplateId: {
      propDefinition: [
        clickup,
        "taskTemplates",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of task",
    },
  },
  async run({ $ }) {
    const {
      listId,
      taskTemplateId,
      name,
    } = this;

    const response = this.clickup.createTaskFromTemplate({
      $,
      listId,
      taskTemplateId,
      data: {
        name,
      },
    });

    $.export("$summary", "Successfully created task from template");

    return response;
  },
};
