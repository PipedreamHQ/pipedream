import app from "../../clio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "clio-create-task",
  name: "Create New Task",
  description: "Creates a new task in Clio. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Tasks/operation/Task#index)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
      description: "The name of the task.",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task.",
      optional: true,
      options: [
        "High",
        "Normal",
        "Low",
      ],
    },
    assigneeType: {
      type: "string",
      label: "Assignee Type",
      description: "Model type of the assignee.",
      options: Object.values(constants.ASSIGNEE_TYPE),
      reloadProps: true,
    },
  },
  methods: {
    getListResourcesFn() {
      const {
        app,
        assigneeType,
      } = this;
      return assigneeType === constants.ASSIGNEE_TYPE.CONTACT
        ? app.listContacts
        : app.listUsers;
    },
    createTask(args = {}) {
      return this.app.post({
        path: "/tasks.json",
        ...args,
      });
    },
  },
  additionalProps() {
    return {
      assigneeId: {
        type: "string",
        label: "Assignee ID",
        description: "ID of the assignee.",
        options: async ({
          prevContext: { params },
          mapper = ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        }) => {
          const listResourcesFn = this.getListResourcesFn();
          if (params === null) {
            return [];
          }
          const {
            data,
            meta: { paging },
          } = await listResourcesFn({
            params,
          });
          return {
            options: data.map(mapper),
            context: {
              params: paging?.next?.includes("?")
                ? Object.fromEntries(
                  new URLSearchParams(paging.next.split("?")[1]),
                )
                : null,
            },
          };
        },
      },
    };
  },
  async run({ $ }) {
    const {
      createTask,
      assigneeType,
      assigneeId,
      description,
      name,
      priority,
    } = this;

    const response = await createTask({
      $,
      data: {
        data: {
          name,
          description,
          priority,
          ...(assigneeType && assigneeId && {
            assignee: {
              id: assigneeId,
              type: assigneeType,
            },
          }),
        },
      },
    });

    $.export("$summary", `Successfully created a new task with ID \`${response.data.id}\``);
    return response;
  },
};
