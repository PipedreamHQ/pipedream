import seatable from "../../seatable.app.mjs";

export default {
  key: "seatable-list-table-name-options",
  name: "List Table Name Options",
  description: "Retrieves available options for the Table Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    seatable,
  },
  async run({ $ }) {
    const options = await seatable.propDefinitions.tableName.options.call(this.seatable);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
