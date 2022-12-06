import constants from "../../common/constants.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-search-persons",
  name: "Search persons",
  description: "Searches all Persons by `name`, `email`, `phone`, `notes` and/or custom fields. This endpoint is a wrapper of `/v1/itemSearch` with a narrower OAuth scope. Found Persons can be filtered by Organization ID. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Persons#searchPersons)",
  version: "0.1.4",
  type: "action",
  props: {
    pipedriveApp,
    term: {
      type: "string",
      label: "Search term",
      description: "The search term to look for. Minimum 2 characters (or 1 if using exact_match).",
    },
    fields: {
      type: "string",
      label: "Search fields",
      description: "A comma-separated string array. The fields to perform the search from. Defaults to all of them.",
      optional: true,
      options: constants.FIELD_OPTIONS,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact match",
      description: "When enabled, only full exact matches against the given term are returned. It is not case sensitive.",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "Will filter Deals by the provided Organization ID. The upper limit of found Deals associated with the Organization is 2000.",
    },
    includeFields: {
      type: "string",
      label: "Include fields",
      description: "Supports including optional fields in the results which are not provided by default.",
      optional: true,
      options: constants.INCLUDE_FIELDS_OPTIONS,
    },
    start: {
      propDefinition: [
        pipedriveApp,
        "start",
      ],
    },
    limit: {
      propDefinition: [
        pipedriveApp,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      term,
      fields,
      exactMatch,
      organizationId,
      includeFields,
      start,
      limit,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.searchPersons({
          term,
          fields,
          exact_match: exactMatch,
          org_id: organizationId,
          include_fields: includeFields,
          start,
          limit,
        });

      $.export("$summary", `Successfully found ${resp.data?.items.length || 0} persons`);

      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to search persons";
    }
  },
};
