import salesforce from "../../salesforce_rest_api.app.mjs";
import { docsInfo } from "../sosl-search/sosl-search.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_select_examples.htm";

export default {
  key: "salesforce_rest_api-soql-search",
  name: "SOQL Query (Object Query)",
  description: `Executes a [Salesforce Object Query Language (SOQL)](${docsLink}) query-based, SQL-like search.`,
  version: "0.2.9",
  type: "action",
  props: {
    salesforce,
    docsInfo,
    exampleInfo: {
      type: "alert",
      alertType: "info",
      content: "Example query: `SELECT Id, Name, BillingCity FROM Account`",
    },
    query: {
      type: "string",
      label: "SOQL Query",
      description: `A SOQL search query. [See the documentation](${docsLink}) for examples and more information.`,
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.query({
      $,
      query: this.query,
    });
    $.export("$summary", `Successfully returned ${response.totalSize} results for SOQL query`);
    return response;
  },
};
