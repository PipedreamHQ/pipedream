import common from "../common/thread-comment-props.mjs";

export default {
  ...common,
  key: "clickup-create-threaded-comment",
  name: "Create Threaded Comment",
  description: "Creates a threaded comment. See the docs [here](https://clickup.com/api) in **Comments / Create Threaded Comment** section.",
  version: "0.0.1",
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
    },
    assignee: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  async run({ $ }) {
    const {
      commentId,
      commentText,
      notifyAll,
      assignee,
    } = this;

    const data = {
      comment_text: commentText,
      notify_all: notifyAll,
    };

    if (assignee) data.assignee = assignee;

    const response = await this.clickup.createThreadedComment({
      $,
      commentId,
      data,
    });

    $.export("$summary", "Successfully created threaded comment");

    return response;
  },
};
