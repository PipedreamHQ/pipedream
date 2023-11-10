import app from "../../productiveio.app.mjs";

export default {
  key: "productiveio-create-task",
  name: "Create Task",
  description: "Creates a new task in Productive. [See the documentation](https://developer.productive.io/tasks.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskListId: {
      propDefinition: [
        app,
        "taskListId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
  },
  methods: {
    createTask(args = {}) {
      return this.app.post({
        path: "/tasks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTask,
      projectId,
      taskListId,
      title,
    } = this;

    const response = await createTask({
      $,
      params: {
        project_id: projectId,
        task_list_id: taskListId,
        title,
      },
    });

    $.export("$summary", `Successfully created task with title \`${response.data?.attributes?.title}\``);
    return response;
  },
};
