import common from "../common/list-props.mjs";

export default {
  key: "clickup-create-view-comment",
  name: "Create View Comment",
  description: "Creates a view comment. [See the documentation](https://clickup.com/api) in **Comments / Create Chat View Comment** section.",
  version: "0.0.11",
  type: "action",
  props: {
    ...common.props,
    commentText: {
      label: "Comment Text",
      description: "The text of the comment",
      type: "string",
    },
    notifyAll: {
      label: "Notify All",
      description: "Will notify all",
      type: "boolean",
      default: false,
      optional: true,
    },
    assignees: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    viewId: {
      propDefinition: [
        common.props.clickup,
        "viewId",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      viewId,
      commentText,
      notifyAll,
      assignees,
    } = this;

    const response = await this.clickup.createViewComment({
      $,
      viewId,
      data: {
        comment_text: commentText,
        notify_all: notifyAll,
        assignees,
      },
    });

    $.export("$summary", "Successfully created view comment");

    return response;
  },
};
