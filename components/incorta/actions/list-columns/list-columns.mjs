import incorta from "../../incorta.app.mjs";

export default {
  key: "incorta-list-columns",
  name: "List Columns",
  description: "Lists the columns (name, data type, nullability) of a specific table or view in an Incorta tenant, via the REST API."
    + " Requires **Schema Name** and **Table Name** — use **List Schemas** then **List Tables** first if you don't already know them."
    + " Use the returned column names when writing a `SELECT` list or `WHERE` clause in **Execute SQL Query**."
    + " Example: calling with Schema Name `pipedream_store` and Table Name `customer` returns entries like `{name: \"CustomerID\", dataType: \"integer\", function: \"key\"}`. [See the documentation](https://docs.incorta.com/latest/references-api-list-schema-objects-endpoint-v2)",
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
      optional: false,
    },
    tableName: {
      propDefinition: [
        incorta,
        "tableName",
      ],
    },
  },
  async run({ $ }) {
    const objects = await this.incorta.listSchemaObjects({
      $,
      schemaName: this.schemaName,
    });
    const table = objects.find((o) => (o.name ?? o.tableName) === this.tableName);
    const columns = table?.columns ?? table?.fields ?? [];

    $.export("$summary", `Found ${columns.length} ${columns.length === 1
      ? "column"
      : "columns"} in ${this.tableName}`);

    return columns;
  },
};
