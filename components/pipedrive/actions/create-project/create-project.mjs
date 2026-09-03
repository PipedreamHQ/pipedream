import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-create-project",
  name: "Create Project",
  description: "Creates a new project in Pipedrive. Use **List Project Boards** to obtain a valid Board ID and **List Project Phases** to obtain a valid Phase ID before running this action. Example: to open a project on the first board/phase, call with `title=\"Q3 Website Redesign\"`, `status=\"open\"`, `boardId=\"1\"`, `phaseId=\"1\"` -> returns the created project with its numeric `id`. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#addProject)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
      propDefinition: [
        pipedriveApp,
        "projectStatus",
      ],
    },
    boardId: {
      propDefinition: [
        pipedriveApp,
        "projectBoardId",
      ],
      description: "The ID of the board this project belongs to. Run **List Project Boards** first to obtain a valid board ID.",
    },
    phaseId: {
      propDefinition: [
        pipedriveApp,
        "projectPhaseId",
      ],
      description: "The ID of the phase this project belongs to. Run **List Project Phases** (with the chosen board ID) first to obtain a valid phase ID.",
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
      description: "Array of numeric project-label IDs to associate with the project. Project labels are managed in Pipedrive under **Settings → Labels** — copy the numeric ID for each label you want to apply.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.addProject({
      $,
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
