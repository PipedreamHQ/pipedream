import devin from "../../devin.app.mjs";

export default {
  key: "devin-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available options for the Folder ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    devin,
  },
  async run({ $ }) {
    const options = await devin.propDefinitions.folderId.options.call(this.devin);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
