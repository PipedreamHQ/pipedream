import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-table-records",
  name: "Get Table Records",
  description: "Retrieves multiple records for the specified table.",
  version: "1.0.0",
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
    sysparmQuery: {
      type: "string",
      optional: true,
    },
    sysparmDisplayValue: {
      type: "string",
      description: "Return field display values (true), actual values (false), or both (all) (default: false).",
      optional: true,
      options: [
        "true",
        "false",
        "all",
      ],
    },
    sysparmExcludeReferenceLink: {
      type: "boolean",
      description: "True to exclude Table API links for reference fields (default: false).",
      optional: true,
    },
    sysparmSuppressPaginationHeader: {
      type: "boolean",
      description: "True to supress pagination header (default: false).",
      optional: true,
    },
    sysparmFields: {
      type: "string",
      description: "A comma-separated list of fields to return in the response.",
      optional: true,
    },
    sysparmLimit: {
      type: "string",
      description: "The maximum number of results returned per page (default: 10,000).",
      optional: true,
    },
    sysparmView: {
      type: "string",
      description: "Render the response according to the specified UI view (overridden by sysparm_fields).",
      optional: true,
    },
    sysparmQueryCategory: {
      type: "string",
      description: "Name of the query category (read replica category) to use for queries.",
      optional: true,
    },
    sysparmQueryNoDomain: {
      type: "boolean",
      description: "True to access data across domains if authorized (default: false).",
      optional: true,
    },
    sysparmNoCount: {
      type: "boolean",
      description: "Do not execute a select count(*) on table (default: false).",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#table-GET-id                    */

    return await this.servicenow.getTableRecords({
      $,
      table: this.table,
      params: {
        sysparm_query: this.sysparmQuery,
        sysparm_display_value: this.sysparmDisplayValue,
        sysparm_exclude_reference_link: this.sysparmExcludeReferenceLink,
        sysparm_suppress_pagination_header: this.sysparmSuppressPaginationHeader,
        sysparm_fields: this.sysparmFields,
        sysparm_limit: this.sysparmLimit,
        sysparm_view: this.sysparmView,
        sysparm_query_category: this.sysparmQueryCategory,
        sysparm_query_no_domain: this.sysparmQueryNoDomain,
        sysparm_no_count: this.sysparmNoCount,
      },
    });
  },
};
