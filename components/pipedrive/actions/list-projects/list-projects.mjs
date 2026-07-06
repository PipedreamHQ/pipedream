import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-projects",
  name: "List Projects",
  description: "Lists projects in your Pipedrive account. Use the returned IDs with **Get Project**, **Update Project**, **Delete Project**, or **Create Task**. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#getProjects)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    status: {
      propDefinition: [
        pipedriveApp,
        "projectStatus",
      ],
      description: "Filter by project status. One of: open, completed, canceled, deleted (deleted excluded by default).",
    },
    phaseId: {
      propDefinition: [
        pipedriveApp,
        "projectPhaseId",
      ],
      description: "Filter by phase ID. Run **List Project Phases** first to obtain a valid phase ID.",
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "Filter by associated deal ID.",
      optional: true,
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "Filter by associated person ID. Use **List Persons** to obtain a valid person ID.",
      optional: true,
    },
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "Filter by associated organization ID. Use **List Organizations** to obtain a valid organization ID.",
      optional: true,
    },
    filterId: {
      type: "integer",
      label: "Filter ID",
      description: "The ID of the filter to apply to projects. Use **List Filters** to obtain a valid filter ID.",
      min: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "For pagination, the number of entries to return. Min 1, max 500 (server-side cap). Defaults to 100 if omitted.",
      min: 1,
      max: 500,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "For pagination, the cursor to the next page of results (from additional_data.next_cursor). If omitted, the first page is returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.listProjects({
      $,
      status: this.status,
      phase_id: this.phaseId,
      deal_id: this.dealId,
      person_id: this.personId,
      org_id: this.orgId,
      filter_id: this.filterId,
      limit: this.limit,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} projects`);
    return response;
  },
};
