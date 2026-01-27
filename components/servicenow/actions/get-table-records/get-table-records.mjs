import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-table-records",
  name: "Get Table Records",
  description: "Retrieves multiple records for the specified table. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-GET)",
  version: "1.0.2",
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
    filterInfo: {
      type: "alert",
      alertType: "info",
      content: "You must provide either a `Query` or at least one `Filter` prop. ",
    },
    query: {
      label: "Query",
      type: "string",
      description: "An [encoded query string](https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/use/using-lists/concept/c_EncodedQueryStrings.html) to filter records by (e.g., `active=true^priority=1`). This overrides any other filters set.",
      optional: true,
    },
    filterCreatedAtDate: {
      type: "string",
      label: "Filter by Date Created",
      description: "Return records created only after the given date, in the format `YYYY-MM-DD HH:MM:SS` (e.g. `2026-01-01 00:00:00`).",
      optional: true,
    },
    filterUpdatedAtDate: {
      type: "string",
      label: "Filter by Date Updated",
      description: "Return records updated only after the given date, in the format `YYYY-MM-DD HH:MM:SS` (e.g. `2026-01-01 00:00:00`).",
      optional: true,
    },
    filterActive: {
      type: "boolean",
      label: "Filter by Active",
      description: "If set to `true`, only return records that are active. If set to `false`, only return records that are inactive. May not be available for all tables.",
      optional: true,
    },
    responseDataFormat: {
      propDefinition: [
        servicenow,
        "responseDataFormat",
      ],
    },
    excludeReferenceLinks: {
      propDefinition: [
        servicenow,
        "excludeReferenceLinks",
      ],
    },
    responseFields: {
      propDefinition: [
        servicenow,
        "responseFields",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return",
      min: 1,
      default: 10000,
      optional: true,
    },
    responseView: {
      propDefinition: [
        servicenow,
        "responseView",
      ],
    },
    queryNoDomain: {
      propDefinition: [
        servicenow,
        "queryNoDomain",
      ],
    },
  },
  async run({ $ }) {
    let query = this.query;

    // If no query is provided, build one from the filters
    if (!query) {
      const filters = [];

      if (this.filterCreatedAtDate) {
        filters.push(`sys_created_on>=${this.filterCreatedAtDate}`);
      }

      if (this.filterUpdatedAtDate) {
        filters.push(`sys_updated_on>=${this.filterUpdatedAtDate}`);
      }

      if (this.filterActive !== undefined) {
        filters.push(`active=${this.filterActive}`);
      }

      if (!filters.length) {
        throw new ConfigurationError("You must provide either a `Query` or at least one `Filter` prop.");
      }

      query = filters.join("^");
    }

    const response = await this.servicenow.getTableRecords({
      $,
      table: this.table,
      params: {
        sysparm_query: query,
        sysparm_display_value: this.responseDataFormat,
        sysparm_exclude_reference_link: this.excludeReferenceLinks,
        sysparm_fields: this.responseFields?.join?.() || this.responseFields,
        sysparm_limit: this.limit,
        sysparm_view: this.responseView,
        sysparm_query_no_domain: this.queryNoDomain,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} record(s) from table "${this.table}"`);

    return response;
  },
};
