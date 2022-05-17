import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-create-chat-view-comment",
  name: "Create Chat View Comment",
  description: "Creates a chat view comment. See the docs [here](https://clickup.com/api) in **Comments  / Create Chat View Comment** section.",
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
          spaceId: c.spaceId,
          folderId: c.folderId,
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
    },
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
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
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
