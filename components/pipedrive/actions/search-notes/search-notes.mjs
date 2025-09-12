import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-search-notes",
  name: "Search Notes",
  description: "Search for notes in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Notes#getNotes)",
  version: "0.0.5",
  type: "action",
  props: {
    pipedriveApp,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for in the note content",
      optional: true,
    },
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead that the note is attached to",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal that the note is attached to",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person that the note is attached to",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization that the note is attached to",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "The ID of the user that the note is attached to",
    },
    projectId: {
      propDefinition: [
        pipedriveApp,
        "projectId",
      ],
      description: "The ID of the project that the note is attached to",
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "The field name to sort by",
      options: [
        "id",
        "user_id",
        "deal_id",
        "org_id",
        "person_id",
        "content",
        "add_time",
        "update_time",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort the results in",
      options: [
        "ASC",
        "DESC",
      ],
      default: "DESC",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The date in format of YYYY-MM-DD from which notes to fetch",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The date in format of YYYY-MM-DD until which notes to fetch to",
      optional: true,
    },
    pinnedToLeadFlag: {
      type: "boolean",
      label: "Pinned to Lead Flag",
      description: "If `true`, the results are filtered by note to lead pinning state",
      optional: true,
    },
    pinnedToDealFlag: {
      type: "boolean",
      label: "Pinned to Deal Flag",
      description: "If `true`, the results are filtered by note to deal pinning state",
      optional: true,
    },
    pinnedToOrganizationFlag: {
      type: "boolean",
      label: "Pinned to Organization Flag",
      description: "If `true`, the results are filtered by note to organization pinning state",
      optional: true,
    },
    pinnedToPersonFlag: {
      type: "boolean",
      label: "Pinned to Person Flag",
      description: "If `true`, the results are filtered by note to person pinning state",
      optional: true,
    },
    pinnedToProjectFlag: {
      type: "boolean",
      label: "Pinned to Project Flag",
      description: "If `true`, the results are filtered by note to project pinning state",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    let notes = await this.pipedriveApp.getPaginatedResources({
      fn: this.pipedriveApp.getNotes,
      params: {
        user_id: this.userId,
        lead_id: this.leadId,
        deal_id: this.dealId,
        person_id: this.personId,
        org_id: this.organizationId,
        project_id: this.projectId,
        sort: this.sortField
          ? `${this.sortField} ${this.sortDirection}`
          : undefined,
        pinned_to_lead_flag: this.pinnedToLeadFlag === true
          ? 1
          : undefined,
        pinned_to_deal_flag: this.pinnedToDealFlag === true
          ? 1
          : undefined,
        pinned_to_organization_flag: this.pinnedToOrganizationFlag === true
          ? 1
          : undefined,
        pinned_to_person_flag: this.pinnedToPersonFlag === true
          ? 1
          : undefined,
        pinned_to_project_flag: this.pinnedToProjectFlag === true
          ? 1
          : undefined,
        start_date: this.startDate,
        end_date: this.endDate,
      },
      max: this.maxResults,
    });

    if (this.searchTerm) {
      notes = notes.filter((note) =>
        note.content?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    $.export("$summary", `Successfully found ${notes.length} note${notes.length === 1
      ? ""
      : "s"}`);
    return notes;
  },
};
