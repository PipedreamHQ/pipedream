import app from "../../ftrack.app.mjs";

export default {
  key: "ftrack-update-task",
  name: "Update Task",
  description: "Update attributes of a task. [See the documentation](https://help.ftrack.com/en/articles/1040498-operations#update)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task.",
    },
    link: {
      type: "string",
      label: "Link",
      description: "The link of the task.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task.",
      optional: true,
    },
  },
  methods: {
    updateTask({
      taskId, data = {}, ...args
    } = {}) {
      return this.app.update({
        data: {
          entity_type: "Task",
          entity_key: [
            taskId,
          ],
          entity_data: data,
        },
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      updateTask,
      taskId,
      name,
      link,
      description,
    } = this;

    const [
      response,
    ] = await updateTask({
      step,
      taskId,
      data: {
        name,
        link,
        description,
      },
    });

    step.export("$summary", `Successfully updated task with ID \`${response.data.id}\`.`);

    return response.data;
  },
};
