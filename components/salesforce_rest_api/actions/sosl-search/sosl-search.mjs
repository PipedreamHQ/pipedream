// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_examples.htm";

export const docsInfo = {
  type: "alert",
  alertType: "info",
  content: "You can find helpful information on SOQL and SOSL in [the Salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm).",
};

export default {
  key: "salesforce_rest_api-sosl-search",
  name: "SOSL Search (Object Search)",
  description: "Run a SOSL text search with guided prompts."
    + " Prefer **Text Search** for agent and API use - it takes a plain keyword and searches several object types at once."
    + " SOSL matches indexed text fields, so it finds partial words but will not filter on numeric or date criteria."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.2.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    docsInfo,
    exampleInfo: {
      type: "alert",
      alertType: "info",
      content: "Example search: `FIND {Joe Smith} IN Name Fields RETURNING lead(name, phone)`",
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
    $.export("$summary", `Successfully returned ${response.searchRecords?.length} results for SOSL search`);
    return response;
  },
};
