// legacy_hash_id: a_4rixdN
import { axios } from "@pipedream/platform";

export default {
  key: "pipedrive-search-persons",
  name: "Search persons",
  description: "Searches all Persons by name, email, phone, notes and/or custom fields. This endpoint is a wrapper of /v1/itemSearch with a narrower OAuth scope. Found Persons can be filtered by Organization ID.",
  version: "0.1.1",
  type: "action",
  props: {
    pipedrive: {
      type: "app",
      app: "pipedrive",
    },
    companydomain: {
      type: "string",
      label: "Company domain",
      description: "Your company name as registered in Pipedrive, which becomes part of Pipedrive API base url.",
    },
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
      options: [
        "custom_fields",
        "email",
        "notes",
        "phone",
        "name",
      ],
    },
    exact_match: {
      type: "boolean",
      label: "Exact match",
      description: "When enabled, only full exact matches against the given term are returned. It is not case sensitive.",
      optional: true,
    },
    organization_id: {
      type: "integer",
      label: "Organization ID",
      description: "Will filter Deals by the provided Organization ID. The upper limit of found Deals associated with the Organization is 2000.",
      optional: true,
    },
    include_fields: {
      type: "string",
      label: "Optional fields",
      description: "Supports including optional fields in the results which are not provided by default.",
      optional: true,
      options: [
        "person.picture",
      ],
    },
    start: {
      type: "integer",
      label: "Pagination start",
      description: "Pagination start. Note that the pagination is based on main results and does not include related items when using search_for_related_items parameter.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Items shown per page.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the Pipedrive API docs here: https://developers.pipedrive.com/docs/api/v1/#!/Persons/get_persons_search
    const config = {
      method: "get",
      url: `https://${this.companydomain}.pipedrive.com/v1/persons/search`,
      params: {
        term: this.term,
        fields: this.fields,
        exact_match: this.exact_match,
        organization_id: this.organization_id,
        include_fields: this.include_fields,
        start: this.start,
        limit: this.limit,
      },
      headers: {
        Authorization: `Bearer ${this.pipedrive.$auth.oauth_access_token}`,
      },

    };
    return await axios($, config);
  },
};
