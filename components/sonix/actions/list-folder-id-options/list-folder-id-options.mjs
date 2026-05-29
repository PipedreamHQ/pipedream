import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-list-folder-id-options",
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
    sonix,
  },
  async run({ $ }) {
    const options = await sonix.propDefinitions.folderId.options.call(this.sonix);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
