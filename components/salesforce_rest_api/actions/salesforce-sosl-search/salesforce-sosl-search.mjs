// legacy_hash_id: a_bKijKb
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-sosl-search",
  name: "SOSL Search",
  description: "Executes the specified SOSL search.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    sosl_search_string: {
      type: "string",
      description: "The search string in SOSL.\nFor more information on [SOSL see the SOQL and SOSL Reference.](http://www.salesforce.com/us/developer/docs/soql_sosl/index_Left.htm)\nExample: [Search for a String](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_search.htm).",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    return await axios($, {
      url: `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/search/?q=${encodeURI(this.sosl_search_string)}`,
      headers: {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },

    });
  },
};
