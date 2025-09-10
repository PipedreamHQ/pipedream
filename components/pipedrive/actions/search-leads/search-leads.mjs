import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pipedrive-search-leads",
  name: "Search Leads",
  description: "Search for leads by name or email. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#searchLeads)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    term: {
      type: "string",
      label: "Search Term",
      description: "The search term to look for. Minimum 2 characters (or 1 if using exact_match).",
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "When enabled, only full exact matches against the given term are returned. It is not case sensitive.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Search Fields",
      description: "An array containing fields to perform the search from. Defaults to all of them.",
      optional: true,
      options: constants.LEAD_FIELD_OPTIONS,
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "Will filter leads by the provided Person ID",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "Will filter leads by the provided Organization ID",
    },
    includeFields: {
      type: "string",
      label: "Include fields",
      description: "Supports including optional fields in the results which are not provided by default.",
      optional: true,
      options: [
        "lead.was_seen",
      ],
    },
  },
  async run({ $ }) {
    const { data: { items = [] } } = await this.pipedriveApp.searchLeads({
      term: this.term,
      exact_match: this.exactMatch,
      fields: this.fields,
      person_id: this.personId,
      organization_id: this.organizationId,
      include_fields: this.includeFields,
    });
    $.export("$summary", `Successfully found ${items.length} lead${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
