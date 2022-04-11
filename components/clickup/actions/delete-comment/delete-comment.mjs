import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment. See the docs [here](https://clickup.com/api) in **Comments  / Deleet Comment** section.",
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
      optional: true,
    },
    viewId: {
      propDefinition: [
        clickup,
        "views",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          listId: c.listId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
    commentId: {
      propDefinition: [
        clickup,
        "comments",
        (c) => ({
          listId: c.listId,
          taskId: c.taskId,
          viewId: c.viewId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { commentId } = this;

    return this.clickup.deleteComment({
      $,
      commentId,
    });
  },
};
