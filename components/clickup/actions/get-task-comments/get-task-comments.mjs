import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-task-comments",
  name: "Get Task Comments",
  description: "Get a task comments. See the docs [here](https://clickup.com/api) in **Comments  / Get Task Comments** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { taskId } = this;

    return this.clickup.getTaskComments({
      $,
      taskId,
    });
  },
};
