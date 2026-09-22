import microsoft_sql_server from "../../microsoft_sql_server.app.mjs";

export default {
  key: "microsoft_sql_server-list-table-options",
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
    microsoft_sql_server,
  },
  async run({ $ }) {
    const options = await microsoft_sql_server.propDefinitions.table.options
      .call(this.microsoft_sql_server);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
