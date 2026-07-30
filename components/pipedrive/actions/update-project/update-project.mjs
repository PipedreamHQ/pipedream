// x-pd-ai: optimized
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-project",
  name: "Update Project",
  description: "Updates an existing project. Run **List Projects** first to obtain a valid project ID; use **List Project Boards** and **List Project Phases** for board and phase IDs. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#updateProject)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to update. Run **List Projects** first to obtain a valid project ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The updated title of the project.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated description of the project.",
      optional: true,
    },
    status: {
      propDefinition: [
        pipedriveApp,
        "projectStatus",
      ],
      description: "The updated status of the project. One of: open, completed, canceled, deleted.",
    },
    boardId: {
      propDefinition: [
        pipedriveApp,
        "projectBoardId",
      ],
      description: "The ID of the board. Run **List Project Boards** first to obtain a valid board ID.",
    },
    phaseId: {
      propDefinition: [
        pipedriveApp,
        "projectPhaseId",
      ],
      description: "The ID of the phase. Run **List Project Phases** first to obtain a valid phase ID.",
    },
    ownerId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      label: "Owner ID",
      description: "The user ID of the project owner.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project. Format: YYYY-MM-DD.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the project. Format: YYYY-MM-DD.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.updateProject({
      $,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      status: this.status,
      board_id: this.boardId,
      phase_id: this.phaseId,
      owner_id: this.ownerId,
      start_date: this.startDate,
      end_date: this.endDate,
    });
    $.export("$summary", `Successfully updated project ${this.projectId}`);
    return response;
  },
};
