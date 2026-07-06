import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pipedrive-create-project",
  name: "Create Project",
  description: "Creates a new project in Pipedrive. Use **List Project Boards** to obtain a valid Board ID and **List Project Phases** to obtain a valid Phase ID before running this action. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#addProject)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the project.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the project.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the project. One of: open, completed, canceled, deleted.",
      options: constants.PROJECT_STATUS_OPTIONS,
      optional: true,
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board this project belongs to. Run **List Project Boards** first to obtain a valid board ID.",
      optional: true,
    },
    phaseId: {
      type: "string",
      label: "Phase ID",
      description: "The ID of the phase this project belongs to. Run **List Project Phases** (with the chosen board ID) first to obtain a valid phase ID.",
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "The user ID of the project owner. Run **List User ID Options** to obtain a valid user ID.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project. Format: YYYY-MM-DD (e.g. 2026-07-31).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the project. Format: YYYY-MM-DD (e.g. 2026-08-31).",
      optional: true,
    },
    dealIds: {
      type: "string[]",
      label: "Deal IDs",
      description: "Array of deal IDs to associate with the project. Use **List Deals** to obtain a valid deal ID.",
      optional: true,
    },
    personIds: {
      type: "string[]",
      label: "Person IDs",
      description: "Array of person IDs to associate with the project. Use **List Persons** to obtain a valid person ID.",
      optional: true,
    },
    orgIds: {
      type: "string[]",
      label: "Organization IDs",
      description: "Array of organization IDs to associate with the project. Use **List Organizations** to obtain a valid organization ID.",
      optional: true,
    },
    labelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "Array of label IDs to associate with the project.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.addProject({
      title: this.title,
      description: this.description,
      status: this.status,
      board_id: this.boardId,
      phase_id: this.phaseId,
      owner_id: this.ownerId,
      start_date: this.startDate,
      end_date: this.endDate,
      deal_ids: this.dealIds,
      person_ids: this.personIds,
      org_ids: this.orgIds,
      label_ids: this.labelIds,
    });
    $.export("$summary", `Successfully created project ${response.data?.id}: ${this.title}`);
    return response;
  },
};
