import incorta from "../../incorta.app.mjs";
import utils from "../../common/utils.mjs";

const SCHEMA_BATCH_SIZE = 5;

export default {
  key: "incorta-list-tables",
  name: "List Tables",
  description: "Lists the tables and views (\"schema objects\") in an Incorta tenant, via the REST API."
    + " Provide **Schema Name** to scope the results to one schema (use **List Schemas** to find valid names); omit it to list tables across every schema in the tenant."
    + " Use the returned table names as the `FROM` target in **Execute SQL Query**, and pass a table name to **List Columns** to see its column definitions."
    + " Use **Limit** and **Offset** to page through large result sets: the response includes `total` (tables matched before paging), `hasMore`, and `nextOffset` (pass it as **Offset** to get the next page). If `hasMore` is true the list is truncated, so keep paging or narrow with **Schema Name**."
    + " Example: calling with Schema Name `pipedream_store` returns `{tables: [{schemaName: \"pipedream_store\", tableName: \"customer\", type: \"table\"}], errors: [], total: 1, hasMore: false}`. When listing across all schemas, schemas that could not be read are reported in `errors` (`{schemaName, error}`) and the list is then incomplete. [See the documentation](https://docs.incorta.com/latest/references-api-list-schema-objects-endpoint-v2)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    incorta,
    schemaName: {
      propDefinition: [
        incorta,
        "schemaName",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of tables to return. Omit to return all. Use with **Offset** to page through large tenants.",
      min: 1,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of tables to skip before returning results (default 0). To get the next page, pass the `nextOffset` value from the previous response.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    // Paging is applied to the combined, ordered list, since the API pages
    // per schema and has no cross-schema pagination.
    const paginate = (all) => {
      const start = this.offset ?? 0;
      const end = this.limit
        ? start + this.limit
        : all.length;
      const hasMore = end < all.length;
      return {
        tables: all.slice(start, end),
        total: all.length,
        hasMore,
        ...(hasMore && {
          nextOffset: end,
        }),
      };
    };

    const summarizePage = (page) => page.hasMore
      ? `; returned ${page.tables.length}, more available (nextOffset ${page.nextOffset})`
      : "";

    const fetchObjects = async (schemaName) => {
      const objects = await this.incorta.listSchemaObjects({
        $,
        schemaName,
      });
      return objects.map((object) => ({
        schemaName,
        tableName: utils.getItemName(object),
        type: object.type,
      }));
    };

    // A specific schema was requested: let any error propagate so a typo
    // or permission problem doesn't look like "0 tables".
    if (this.schemaName) {
      const page = paginate(await fetchObjects(this.schemaName));
      $.export("$summary", `Found ${page.total} ${page.total === 1
        ? "table"
        : "tables"} in schema ${this.schemaName}${summarizePage(page)}`);
      return {
        ...page,
        errors: [],
      };
    }

    const schemaNames = utils.namesOf(await this.incorta.listSchemas({
      $,
    }));

    // Fetch each schema's objects in small concurrent batches rather than
    // one request at a time (or all at once), since there's no bulk
    // "objects across schemas" endpoint. Use allSettled so one unreadable
    // schema doesn't discard the tables that did load.
    const tables = [];
    const errors = [];
    for (let i = 0; i < schemaNames.length; i += SCHEMA_BATCH_SIZE) {
      const batch = schemaNames.slice(i, i + SCHEMA_BATCH_SIZE);
      const results = await Promise.allSettled(batch.map(fetchObjects));
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          tables.push(...result.value);
        } else {
          errors.push({
            schemaName: batch[index],
            error: result.reason?.message ?? String(result.reason),
          });
        }
      });
    }

    // Every schema failed: likely credentials or connectivity rather than a
    // per-schema problem, so surface it as an error.
    if (errors.length && errors.length === schemaNames.length) {
      throw new Error(`Failed to list tables for all ${schemaNames.length} schemas. First error: ${errors[0].error}`);
    }

    const readCount = schemaNames.length - errors.length;
    const failedNote = errors.length
      ? `; ${errors.length} ${errors.length === 1
        ? "schema"
        : "schemas"} could not be read (${errors.map((e) => e.schemaName).join(", ")}), so this list is incomplete`
      : "";
    const page = paginate(tables);
    $.export("$summary", `Found ${page.total} ${page.total === 1
      ? "table"
      : "tables"} across ${readCount} ${readCount === 1
      ? "schema"
      : "schemas"}${summarizePage(page)}${failedNote}`);

    return {
      ...page,
      errors,
    };
  },
};
