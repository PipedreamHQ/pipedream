import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "sendgrid-search-contacts",
  name: "Search Contacts",
  description: "Searches contacts with a SGQL query. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/search-contacts)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description: "The query field accepts valid SGQL for searching for a contact (.e.g `email LIKE 'hung.v%'` ). Only the first 50 contacts will be returned. [For more information about SGQL](https://docs.sendgrid.com/for-developers/sending-email/segmentation-query-language)",
      optional: true,
    },
    queryField: {
      type: "string",
      label: "Query Field",
      description: "Select the field to search",
      options: constants.CONTACT_FIELDS,
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.queryField) {
      props.queryValue = {
        type: "string",
        label: "Query Value",
        description: `The ${this.queryField} value to search for`,
      };
      props.matchCase = {
        type: "string",
        label: "Query Match Case",
        description: "`Exact` will return only exact matches. `Fuzzy` is case insensitive and will return matches that include the search term.",
        options: constants.QUERY_MATCH_CASE_OPTIONS,
        default: "Fuzzy",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      query,
      queryField,
      queryValue,
      matchCase,
    } = this;

    if ((query && queryField) || (!query && !queryField)) {
      throw new ConfigurationError("Please enter only one of `query` or `queryField`");
    }

    let q;
    if (query) {
      q = query;
    } else {
      q = matchCase === "Fuzzy"
        ? `lower(${queryField}) LIKE '%${queryValue}%'`
        : `${queryField} = '${queryValue}'`;
    }

    console.log(q);
    const resp = await this.sendgrid.searchContacts(q);
    $.export("$summary", "Successfully completed search");
    return resp;
  },
};
