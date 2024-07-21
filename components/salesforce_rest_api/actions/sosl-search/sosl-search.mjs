import salesforce from "../../salesforce_rest_api.app.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_examples.htm";

export default {
  key: "salesforce_rest_api-sosl-search",
  name: "SOSL Search (Object Search)",
  description: `Executes a [Salesforce Object Search Language (SOSL)](${docsLink}) text-based search query.`,
  version: "0.3.{{ts}}",
  type: "action",
  props: {
    salesforce,
    exampleInfo: {
      type: "alert",
      alertType: "info",
      content: "Example query: `FIND {Joe Smith} IN Name Fields RETURNING lead(name, phone)`",
    },
    search: {
      type: "string",
      label: "SOSL Query",
      description: `A SOSL search query. [See the documentation](${docsLink}) for examples and more information.`,
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.search({
      $,
      search: this.search,
    });
    $.export("$summary", `Successfully returned ${response.searchRecords} results for SOSL search`);
    return response;
  },
};
