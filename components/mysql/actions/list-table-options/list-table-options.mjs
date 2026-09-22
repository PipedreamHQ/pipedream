import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-list-table-options",
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
    mysql,
  },
  async run({ $ }) {
    const options = await mysql.propDefinitions.table.options.call(this.mysql);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
