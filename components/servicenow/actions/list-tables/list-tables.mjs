import servicenow from "../../servicenow.app.mjs";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 10,
});

export default {
  key: "servicenow-list-tables",
  name: "List Tables",
  description: "List all tables in the ServiceNow instance. [See the documentation](https://www.servicenow.com/docs/r/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    servicenow,
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
    const query = filters.length
      ? filters.join("^")
      : undefined;

    // Get tables
    const tables = await this.servicenow.getTableRecords({
      $,
      table: "sys_db_object",
      params: {
        sysparm_query: query,
      },
    });

    // Poll tables to check if they are accessible to the user
    // Uses bottleneck so calls can be made concurrently, and exit when limit is reached
    const accessibleTables = [];

    for (const table of tables) {
      if (accessibleTables.length >= this.limit) break;

      try {
        await limiter.schedule(() =>
          this.servicenow.getRecordCountsByField({
            $,
            table: table.name,
            params: {
              sysparm_count: true,
            },
          }));

        accessibleTables.push(table);
      } catch {
        // ignore
      }
    }

    $.export("$summary", `Successfully retrieved ${accessibleTables.length} table${accessibleTables.length === 1
      ? ""
      : "s"}`);
    return accessibleTables;
  },
};
