// legacy_hash_id: a_RAiV1n
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-soql-search",
  name: "SOQL Search",
  description: "Executes a SOQL query that returns all the results in a single response, or if needed, returns part of the results and an identifier used to retrieve the remaining results.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    soql_search_string: {
      type: "string",
      description: "The search string in SOQL.\nFor more information on [SOSL see the SOQL and SOSL Reference.](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm)\nExample: [Execute SOQL Query](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm).",
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    return await axios($, {
      url: `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/query/?q=${encodeURI(this.soql_search_string)}`,
      headers: {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
    });
  },
};
