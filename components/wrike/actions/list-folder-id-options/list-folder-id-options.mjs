import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-folder-id-options",
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
    wrike,
  },
  async run({ $ }) {
    const options = await wrike.propDefinitions.folderId.options.call(this.wrike);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
