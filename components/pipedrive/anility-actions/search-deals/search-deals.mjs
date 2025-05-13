import constants from "../../common/constants.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-search-deals",
  name: "Search Deals (Anility)",
  description: "Searches all deals by custom field. This endpoint is a wrapper of `/v1/itemSearch` with a narrower OAuth scope. Found organizations can be filtered by Organization ID. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Deals#searchDeals)",
  version: "0.0.1",
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
      description: "A comma-separated string array. The fields to perform the search from. Defaults to all of them. Only the following custom field types are searchable: address, custom_fields, notes, name",
      optional: true,
      options: constants.FIELD_OPTIONS,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact match",
      description: "When enabled, only full exact matches against the given term are returned. It is not case sensitive.",
      optional: true,
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
      start,
      limit,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.searchDeals({
          term,
          fields,
          exact_match: exactMatch,
          start,
          limit,
        });

      $.export("$summary", `Successfully found ${resp.data?.items.length || 0} deals`);

      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to search deals";
    }
  },
};
