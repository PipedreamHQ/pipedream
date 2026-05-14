import rewiser from "../../rewiser.app.mjs";

export default {
  key: "rewiser-list-folder-id-options",
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
    rewiser,
  },
  async run({ $ }) {
    const options = await rewiser.propDefinitions.folderId.options.call(this.rewiser);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
