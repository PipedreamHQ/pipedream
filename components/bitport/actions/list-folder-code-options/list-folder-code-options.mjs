import bitport from "../../bitport.app.mjs";

export default {
  key: "bitport-list-folder-code-options",
  name: "List Folder Code Options",
  description: "Retrieves available options for the Folder Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitport,
  },
  async run({ $ }) {
    const options = await bitport.propDefinitions.folderCode.options.call(this.bitport);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
