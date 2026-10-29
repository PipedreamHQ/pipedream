import incorta from "../../incorta_oauth.app.mjs";
import utils from "../../common/utils.mjs";

const SCHEMA_BATCH_SIZE = 5;
const API_PAGE_SIZE = 200;

export default {
  key: "incorta_oauth-list-tables",
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
      description: "Maximum number of tables to return, e.g. `10` to return the first 10. Omit to return all. Use with **Offset** to page through large tenants.",
      min: 1,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of tables to skip before returning results (default 0), e.g. `200` to skip the first 200. To get the next page, pass the `nextOffset` value from the previous response.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const start = this.offset ?? 0;
    const end = this.limit
      ? start + this.limit
      : Infinity;

    const toTables = (schemaName, objects) => objects.map((object) => ({
      schemaName,
      tableName: utils.getItemName(object),
      type: object.type,
    }));

    // Fetches objects [from, to) of one schema, reading only the API pages
    // that overlap that range. Also returns the schema's `total`.
    const fetchRange = async (schemaName, from, to) => {
      const objects = [];
      let total = Infinity;
      let cursor = from;
      while (cursor < total && cursor < to) {
        const page = await this.incorta.listSchemaObjectsPage({
          $,
          schemaName,
          offset: cursor,
          limit: Math.min(API_PAGE_SIZE, to - cursor),
        });
        objects.push(...page.objects);
        total = page.total;
        if (!page.objects.length) break;
        cursor += page.objects.length;
      }
      return {
        objects,
        total: total === Infinity
          ? 0
          : total,
      };
    };

    // `total` is the full count before paging; `end` is where the
    // requested window stopped (also the next offset when more remain).
    const buildPage = (tables, total) => {
      const hasMore = end < total;
      return {
        tables,
        total,
        hasMore,
        ...(hasMore && {
          nextOffset: end,
        }),
      };
    };

    const summarizePage = (page) => page.hasMore
      ? `; returned ${page.tables.length}, more available (nextOffset ${page.nextOffset})`
      : "";

    // A specific schema was requested: let any error propagate so a typo
    // or permission problem doesn't look like "0 tables".
    if (this.schemaName) {
      const {
        objects, total,
      } = await fetchRange(this.schemaName, start, end);
      const page = buildPage(toTables(this.schemaName, objects), total);
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

    // Runs `task` over `items` in small concurrent batches rather than one
    // at a time (or all at once). allSettled so one unreadable schema
    // doesn't discard the results that did load.
    const settleInBatches = async (items, task) => {
      const results = [];
      for (let i = 0; i < items.length; i += SCHEMA_BATCH_SIZE) {
        const batch = items.slice(i, i + SCHEMA_BATCH_SIZE);
        results.push(...await Promise.allSettled(batch.map(task)));
      }
      return results;
    };

    const errors = [];
    const recordError = (schemaName, reason) => errors.push({
      schemaName,
      error: reason?.message ?? String(reason),
    });

    // Pass 1: read the first API page of every schema. This gives each
    // schema's `total` (needed to place the requested window in the combined
    // list) and, for schemas under one page, already holds all their objects.
    const firstPages = await settleInBatches(
      schemaNames,
      (schemaName) => fetchRange(schemaName, 0, API_PAGE_SIZE),
    );
    const schemas = [];
    firstPages.forEach((result, index) => {
      if (result.status === "fulfilled") {
        schemas.push({
          schemaName: schemaNames[index],
          ...result.value,
        });
      } else {
        recordError(schemaNames[index], result.reason);
      }
    });

    // Every schema failed: likely credentials or connectivity rather than a
    // per-schema problem, so surface it as an error.
    if (errors.length && errors.length === schemaNames.length) {
      throw new Error(`Failed to list tables for all ${schemaNames.length} schemas. First error: ${errors[0].error}`);
    }

    // Pass 2: map the window [start, end) onto each schema's local range,
    // fetching further API pages only where the first page doesn't cover it.
    let base = 0;
    const wanted = schemas.map((schema) => {
      const from = Math.max(start - base, 0);
      const to = Math.min(end - base, schema.total);
      base += schema.total;
      return {
        ...schema,
        from,
        to,
      };
    });
    const total = base;
    const fetched = await settleInBatches(wanted, async (schema) => {
      if (schema.from >= schema.to) {
        return [];
      }
      if (schema.to <= schema.objects.length) {
        return schema.objects.slice(schema.from, schema.to);
      }
      const { objects } = await fetchRange(schema.schemaName, schema.from, schema.to);
      return objects;
    });
    const tables = [];
    fetched.forEach((result, index) => {
      if (result.status === "fulfilled") {
        tables.push(...toTables(wanted[index].schemaName, result.value));
      } else {
        recordError(wanted[index].schemaName, result.reason);
      }
    });

    const readCount = schemaNames.length - new Set(errors.map((e) => e.schemaName)).size;
    const failedSchemas = [
      ...new Set(errors.map((e) => e.schemaName)),
    ];
    const failedNote = failedSchemas.length
      ? `; ${failedSchemas.length} ${failedSchemas.length === 1
        ? "schema"
        : "schemas"} could not be read (${failedSchemas.join(", ")}), so this list is incomplete`
      : "";
    const page = buildPage(tables, total);
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
