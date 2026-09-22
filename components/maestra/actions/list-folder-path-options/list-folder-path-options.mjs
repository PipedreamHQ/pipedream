import maestra from "../../maestra.app.mjs";

export default {
  key: "maestra-list-folder-path-options",
  name: "List Folder Path Options",
  description: "Retrieves available options for the Folder Path field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    maestra,
  },
  async run({ $ }) {
    const options = await maestra.propDefinitions.folderPath.options.call(this.maestra);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
