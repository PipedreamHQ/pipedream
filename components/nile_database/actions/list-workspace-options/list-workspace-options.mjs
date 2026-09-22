import nile_database from "../../nile_database.app.mjs";

export default {
  key: "nile_database-list-workspace-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nile_database,
  },
  async run({ $ }) {
    const options = await nile_database.propDefinitions.workspace.options.call(this.nile_database);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
