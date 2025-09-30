import app from "../../productive_io.app.mjs";

export default {
  key: "productive_io-create-task",
  name: "Create Task",
  description: "Creates a new task in Productive. [See the documentation](https://developer.productive.io/tasks.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      data: {
        data: {
          type: "tasks",
          attributes: {
            title,
          },
          relationships: {
            project: {
              data: {
                type: "projects",
                id: projectId,
              },
            },
            task_list: {
              data: {
                type: "task_lists",
                id: taskListId,
              },
            },
          },
        },
      },
    });

    $.export("$summary", `Successfully created task with title \`${response.data?.attributes?.title}\``);
    return response;
  },
};
