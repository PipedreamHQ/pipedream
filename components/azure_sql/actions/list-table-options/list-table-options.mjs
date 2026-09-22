import azure_sql from "../../azure_sql.app.mjs";

export default {
  key: "azure_sql-list-table-options",
  name: "List Table Options",
  description: "Retrieves available options for the Table field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azure_sql,
  },
  async run({ $ }) {
    const options = await azure_sql.propDefinitions.table.options.call(this.azure_sql);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
