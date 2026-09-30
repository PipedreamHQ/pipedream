import incorta from "../../incorta.app.mjs";
import utils from "../../common/utils.mjs";

const SCHEMA_BATCH_SIZE = 5;

export default {
  key: "incorta-list-tables",
  name: "List Tables",
  description: "Lists the tables and views (\"schema objects\") in an Incorta tenant, via the REST API."
    + " Provide **Schema Name** to scope the results to one schema (use **List Schemas** to find valid names); omit it to list tables across every schema in the tenant."
    + " Use the returned table names as the `FROM` target in **Execute SQL Query**, and pass a table name to **List Columns** to see its column definitions."
    + " Example: calling with Schema Name `pipedream_store` returns entries like `{schemaName: \"pipedream_store\", tableName: \"customer\", type: \"table\"}`. [See the documentation](https://docs.incorta.com/latest/references-api-list-schema-objects-endpoint-v2)",
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
  },
  async run({ $ }) {
    const schemaNames = this.schemaName
      ? [
        this.schemaName,
      ]
      : utils.namesOf(await this.incorta.listSchemas({
        $,
      }));

    // Fetch each schema's objects in small concurrent batches rather than
    // one request at a time (or all at once), since there's no bulk
    // "objects across schemas" endpoint.
    const tables = [];
    for (let i = 0; i < schemaNames.length; i += SCHEMA_BATCH_SIZE) {
      const batch = schemaNames.slice(i, i + SCHEMA_BATCH_SIZE);
      const tablesBySchema = await Promise.all(batch.map(async (schemaName) => {
        const objects = await this.incorta.listSchemaObjects({
          $,
          schemaName,
        });
        return objects.map((object) => ({
          schemaName,
          tableName: utils.getItemName(object),
          type: object.type,
        }));
      }));
      tables.push(...tablesBySchema.flat());
    }

    $.export("$summary", `Found ${tables.length} ${tables.length === 1
      ? "table"
      : "tables"}`);

    return tables;
  },
};
