import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-create-task-comment",
  name: "Create Task Comment",
  description: "Creates a task comment. See the docs [here](https://clickup.com/api) in **Comments  / Create Task Comment** section.",
  version: "0.0.3",
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
    useCustomTaskIds: {
      propDefinition: [
        clickup,
        "useCustomTaskIds",
      ],
    },
    authorizedTeamId: {
      propDefinition: [
        clickup,
        "authorizedTeamId",
      ],
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
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
      taskId,
      commentText,
      notifyAll,
      assignees,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.createTaskComment({
      $,
      taskId,
      data: {
        comment_text: commentText,
        notify_all: notifyAll,
        assignees,
      },
      params,
    });

    $.export("$summary", "Successfully created task comment");

    return response;
  },
};
