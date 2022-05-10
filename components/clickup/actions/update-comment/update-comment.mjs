import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-update-comment",
  name: "Update Comment",
  description: "Updates a comment. See the docs [here](https://clickup.com/api) in **Comments  / Update Comment** section.",
  version: "0.0.1",
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
    commentText: {
      label: "Comment Text",
      description: "The text of the comment",
      type: "string",
      optional: true,
    },
    assignees: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    resolved: {
      label: "Resolved",
      description: "Set the comment as resolved",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      commentId,
      commentText,
      assignees,
      resolved,
    } = this;

    const response = await this.clickup.updateComment({
      $,
      commentId,
      data: {
        comment_text: commentText,
        assignees,
        resolved,
      },
    });

    $.export("$summary", "Successfully updated comment");

    return response;
  },
};
