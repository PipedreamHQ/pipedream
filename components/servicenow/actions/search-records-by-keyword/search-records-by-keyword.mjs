import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-search-records-by-keyword",
  name: "Search Records by Keyword",
  description: "Search for records by keyword. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-GET)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicenow,
    table: {
      propDefinition: [
        servicenow,
        "table",
      ],
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "If set to true, the keyword will be searched for exactly",
      optional: true,
      default: false,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return",
      min: 1,
      default: 10000,
      optional: true,
    },
    responseDataFormat: {
      propDefinition: [
        servicenow,
        "responseDataFormat",
      ],
    },
  },
  async run({ $ }) {
    // Escape caret characters used in ServiceNow encoded queries
    const sanitizedKeyword = this.keyword.replace(/\^/g, "^^");
    const query = this.exactMatch
      ? `name=${sanitizedKeyword}^ORlabel=${sanitizedKeyword}`
      : `nameLIKE${sanitizedKeyword}^ORlabelLIKE${sanitizedKeyword}`;
    const response = await this.servicenow.getTableRecords({
      $,
      table: this.table,
      params: {
        sysparm_query: query,
        sysparm_limit: this.limit,
        sysparm_display_value: this.responseDataFormat,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} record(s) from table "${this.table}"`);

    return response;
  },
};
