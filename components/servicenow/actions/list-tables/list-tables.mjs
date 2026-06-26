import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-list-tables",
  name: "List Tables",
  description: "List all tables in the ServiceNow instance. [See the documentation](https://www.servicenow.com/docs/r/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    servicenow,
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. Default: 100. Max: 200",
      min: 1,
      max: 200,
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    let query = this.query;
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
      query = filters.join("^");
    }

    // Get tables
    const tables = await this.servicenow.getTableRecords({
      $,
      table: "sys_db_object",
      params: {
        sysparm_query: query,
      },
    });

    // Poll tables to check if they are accessible to the user
    const accessibleTables = (await Promise.allSettled(
      tables.map((t) =>
        this.servicenow
          .getRecordCountsByField({
            $,
            table: t.name,
            params: {
              sysparm_count: true,
            },
          })
          .then(() => t)),
    ))
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value)
      .slice(0, this.limit);

    $.export("$summary", `Successfully retrieved ${accessibleTables.length} table${accessibleTables.length === 1
      ? ""
      : "s"}`);
    return accessibleTables;
  },
};
