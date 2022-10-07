import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-update-checklist",
  name: "Update Checklist",
  description: "Updates a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists  / Edit Checklist** section.",
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
    checklistId: {
      propDefinition: [
        clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of checklist",
    },
    position: {
      label: "Position",
      type: "integer",
      description: "The position of checklist",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      name,
      position,
    } = this;

    const response = await this.clickup.updateChecklist({
      $,
      checklistId,
      data: {
        name,
        position,
      },
    });

    $.export("$summary", "Successfully updated checklist");

    return response;
  },
};
