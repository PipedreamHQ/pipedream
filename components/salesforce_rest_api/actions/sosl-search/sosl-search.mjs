import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-sosl-search",
  name: "SOSL Search",
  description: toSingleLineString(`
    Executes the specified SOSL search.
    See [docs](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl.htm)
  `),
  version: "0.2.6",
  type: "action",
  props: {
    salesforce,
    search: {
      type: "string",
      label: "SOSL Query",
      description: "A SOSL search query",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.search({
      $,
      search: this.search,
    });
    $.export("$summary", "Successfully returned ${response.length} results for SOSL search");
    return response;
  },
};
