import common from "../common/comment-props.mjs";

export default {
  ...common,
  key: "clickup-update-comment",
  name: "Update Comment",
  description: "Updates a comment. [See the documentation](https://clickup.com/api) in **Comments / Update Comment** section.",
  version: "0.0.15",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    commentText: {
      label: "Comment Text",
      description: "The text of the comment",
      type: "string",
      optional: true,
    },
    assignee: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      type: "string",
      description: "Select the assignee",
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
      assignee,
      resolved,
    } = this;

    const response = await this.clickup.updateComment({
      $,
      commentId,
      data: {
        comment_text: commentText,
        assignee,
        resolved,
      },
    });

    $.export("$summary", "Successfully updated comment");

    return response;
  },
};
