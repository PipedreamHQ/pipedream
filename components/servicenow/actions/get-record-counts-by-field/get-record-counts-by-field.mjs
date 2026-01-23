import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-record-counts-by-field",
  name: "Get Record Counts by Field",
  description: "Retrieves the count of records grouped by a specified field from a ServiceNow table. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_AggregateAPI.html#title_aggregate-GET-stats)",
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
    groupByField: {
      type: "string",
      label: "Group By Field",
      description: "The field to group records by (e.g., `priority`, `state`, `category`)",
    },
    count: {
      type: "boolean",
      label: "Count",
      description: "If true, returns the number of records returned by the query",
      optional: true,
      default: true,
    },
    query: {
      label: "Query",
      type: "string",
      description: "An [encoded query string](https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/use/using-lists/concept/c_EncodedQueryStrings.html) to filter records before aggregation (e.g., `active=true^priority=1`)",
      optional: true,
    },
    aggregateInfo: {
      type: "alert",
      alertType: "info",
      content: "You must provide at least one Aggregate Field. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_AggregateAPI.html#title_aggregate-GET-stats) for more information.",
    },
    avgFields: {
      type: "string[]",
      label: "Average Aggregate Fields",
      description: "Numeric fields to calculate averages for (e.g., `reassignment_count`, `reopen_count`)",
      optional: true,
    },
    minFields: {
      type: "string[]",
      label: "Minimum Aggregate Fields",
      description: "Numeric fields to find minimum values for",
      optional: true,
    },
    maxFields: {
      type: "string[]",
      label: "Maximum Aggregate Fields",
      description: "Numeric fields to find maximum values for",
      optional: true,
    },
    sumFields: {
      type: "string[]",
      label: "Sum Aggregate Fields",
      description: "Numeric fields to calculate sums for",
      optional: true,
    },
    havingQuery: {
      type: "string",
      label: "Having Query",
      description: "Filter the aggregated results (e.g., `COUNT>10` to only show groups with more than 10 records)",
      optional: true,
    },
    responseDataFormat: {
      propDefinition: [
        servicenow,
        "responseDataFormat",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to sort results by. Prefix with `^ORDER_BY` for ascending or `^ORDER_BYDESC` for descending (e.g., `^ORDER_BYDESC` + field name)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      sysparm_count: this.count,
      sysparm_query: this.query,
      sysparm_group_by: this.groupByField,
      sysparm_display_value: this.responseDataFormat,
      sysparm_having: this.havingQuery,
      sysparm_order_by: this.orderBy,
    };

    let hasAggregateFields = false;

    // Add aggregate functions for each field type
    if (this.avgFields?.length) {
      params.sysparm_avg_fields = this.avgFields.join?.() || this.avgFields;
      hasAggregateFields = true;
    }
    if (this.minFields?.length) {
      params.sysparm_min_fields = this.minFields.join?.() || this.minFields;
      hasAggregateFields = true;
    }
    if (this.maxFields?.length) {
      params.sysparm_max_fields = this.maxFields.join?.() || this.maxFields;
      hasAggregateFields = true;
    }
    if (this.sumFields?.length) {
      params.sysparm_sum_fields = this.sumFields.join?.() || this.sumFields;
      hasAggregateFields = true;
    }

    if (!hasAggregateFields) {
      throw new ConfigurationError("You must provide at least one Aggregate Field. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_AggregateAPI.html#title_aggregate-GET-stats) for more information.");
    }

    const response = await this.servicenow.getRecordCountsByField({
      $,
      table: this.table,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} records grouped by field "${this.groupByField}"`);

    return response;
  },
};
