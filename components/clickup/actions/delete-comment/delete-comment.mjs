import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment. See the docs [here](https://clickup.com/api) in **Comments  / Deleet Comment** section.",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
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
          spaceId: c.spaceId,
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

    const response = await this.clickup.deleteComment({
      $,
      commentId,
    });

    $.export("$summary", "Successfully deleted comment");

    return response;
  },
};
