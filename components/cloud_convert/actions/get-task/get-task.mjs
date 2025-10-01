import app from "../../cloud_convert.app.mjs";

export default {
  key: "cloud_convert-get-task",
  name: "Get Task",
  description: "Retrieves a task by ID. [See the documentation](https://cloudconvert.com/api/v2/tasks#tasks-show)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    taskId: {
      description: "The ID of the task",
      propDefinition: [
        app,
        "taskId",
      ],
    },
    include: {
      propDefinition: [
        app,
        "include",
      ],
    },
  },
  methods: {
    getTask({
      taskId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/tasks/${taskId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getTask,
      taskId,
      include,
    } = this;

    const response = await getTask({
      $,
      taskId,
      params: {
        include: Array.isArray(include)
          ? include?.join(",")
          : include,
      },
    });

    $.export("$summary", `Successfully retrieved task with ID \`${response.data.id}\``);
    return response;
  },
};
