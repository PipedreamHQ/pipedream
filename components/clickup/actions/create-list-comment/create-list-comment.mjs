import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-create-list-comment",
  name: "Create List Comment",
  description: "Creates a list comment. See the docs [here](https://clickup.com/api) in **Comments  / Create List Comment** section.",
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
      listId,
      commentText,
      notifyAll,
      assignees,
    } = this;

    const response = await this.clickup.createListComment({
      $,
      listId,
      data: {
        comment_text: commentText,
        notify_all: notifyAll,
        assignees,
      },
    });

    $.export("$summary", "Successfully created comment");

    return response;
  },
};
