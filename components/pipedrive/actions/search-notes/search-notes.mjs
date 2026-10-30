import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-search-notes",
  name: "Search Notes",
  description: "Finds notes in Pipedrive, optionally narrowed to one lead, deal, person, organization, project or author, a date range, or pinned notes."
    + " `Search Term` is a case-insensitive substring match on the note content, applied after the other filters, so combine it with an ID filter to keep the scan small."
    + " Find IDs with **Search Leads**, **List Deals**, **Search persons**, **List Organizations**, **List Projects** and **List User ID Options**."
    + " Example: `Deal ID` `1024`, `Search Term` `pricing`, `Max Results` `20`."
    + " Returns an array of notes with `id`, `content` (HTML), `add_time` and the linked record IDs; use **Add Note** to create one or **Remove Duplicate Notes** to clean up repeats."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Notes#getNotes)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Case-insensitive text to look for in the note content, e.g. `pricing`. Omit to return all notes matching the other filters.",
      optional: true,
    },
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "Only include notes attached to this lead. The ID of the lead (a UUID), e.g. `adf21080-0e10-11eb-879b-05d71fb426ec`. Use **Search Leads** or **Get All Leads** to find it (the `id` field).",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "Only include notes attached to this deal. The ID of the deal, e.g. `1024`. Use **List Deals** to find it (the `id` field).",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "Only include notes attached to this person. The ID of the person, e.g. `42`. Use **Search persons** or **List Persons** to find it (the `id` field).",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "Only include notes attached to this organization. The ID of the organization, e.g. `7`. Use **List Organizations** to find it (the `id` field).",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "Only include notes written by this user, e.g. `12345678`. Use **List User ID Options** to find it (the `value` field).",
    },
    projectId: {
      propDefinition: [
        pipedriveApp,
        "projectId",
      ],
      description: "Only include notes attached to this project. The ID of the project, e.g. `5`. Use **List Projects** to find it (the `id` field).",
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort by, e.g. `add_time`. Used together with `Sort Direction`.",
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
      description: "The sort direction: `ASC` or `DESC`, e.g. `DESC` (newest first when sorting by `add_time`). Only applies when `Sort Field` is set.",
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
      description: "Only fetch notes from this date onward, in `YYYY-MM-DD` format, e.g. `2026-01-01`.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Only fetch notes up to this date, in `YYYY-MM-DD` format, e.g. `2026-03-31`.",
      optional: true,
    },
    pinnedToLeadFlag: {
      type: "boolean",
      label: "Pinned to Lead Flag",
      description: "Set to `true` to only include notes pinned to a lead, e.g. `true`.",
      optional: true,
    },
    pinnedToDealFlag: {
      type: "boolean",
      label: "Pinned to Deal Flag",
      description: "Set to `true` to only include notes pinned to a deal, e.g. `true`.",
      optional: true,
    },
    pinnedToOrganizationFlag: {
      type: "boolean",
      label: "Pinned to Organization Flag",
      description: "Set to `true` to only include notes pinned to an organization, e.g. `true`.",
      optional: true,
    },
    pinnedToPersonFlag: {
      type: "boolean",
      label: "Pinned to Person Flag",
      description: "Set to `true` to only include notes pinned to a person, e.g. `true`.",
      optional: true,
    },
    pinnedToProjectFlag: {
      type: "boolean",
      label: "Pinned to Project Flag",
      description: "Set to `true` to only include notes pinned to a project, e.g. `true`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of notes to fetch before `Search Term` is applied, e.g. `50`. Omit to fetch all matching notes.",
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
