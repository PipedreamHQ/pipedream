import { ConfigurationError } from "@pipedream/platform";
import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-task",
  name: "Get Task",
  description: "Get a task. See the docs [here](https://clickup.com/api) in **Tasks  / Get Task** section.",
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
  },
  async run({ $ }) {
    const { taskId } = this;

    const params = {};
    if (this.useCustomTaskIds) {
      if (!this.authorizedTeamId) {
        throw new ConfigurationError("The prop \"Use Custom Task IDs\" must to be used with the prop \"Authorized Team\"");
      }
      params.custom_task_ids = this.useCustomTaskIds;
      params.team_id = this.authorizedTeamId;
    }

    const response = await this.clickup.getTask({
      $,
      taskId,
      params,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
