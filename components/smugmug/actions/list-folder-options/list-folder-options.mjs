import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-list-folder-options",
  name: "List Folder Options",
  description: "Retrieves available options for the Folder field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smugmug,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await smugmug.propDefinitions.folder.options.call(this.smugmug, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
