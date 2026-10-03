import incorta from "../../incorta.app.mjs";

export default {
  key: "incorta-list-schemas",
  name: "List Schemas",
  description: "Lists the schemas (logical groupings of tables/views) defined in the connected Incorta tenant, via the REST API's List Schemas endpoint."
    + " This is the starting point for exploring an Incorta tenant's data model — use the returned schema names with **List Tables** to see the tables/views inside a schema, then **List Columns** for column-level detail."
    + " Example: returns entries like `{schemaName: \"pipedream_store\", schemaType: \"PHYSICAL\", owner: \"...\", isEmpty: false}` and `{schemaName: \"Revenue\", schemaType: \"BUSINESS\", ...}`. [See the documentation](https://docs.incorta.com/latest/references-api-list-schemas-endpoint-v2)",
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
  },
  async run({ $ }) {
    const schemas = await this.incorta.listSchemas({
      $,
    });

    $.export("$summary", `Found ${schemas.length} ${schemas.length === 1
      ? "schema"
      : "schemas"}`);

    return schemas;
  },
};
