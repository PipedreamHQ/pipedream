import guru from "../../guru.app.mjs";

export default {
  key: "guru-list-folder-ids-options",
  name: "List Folder Ids Options",
  description: "Retrieves available options for the Folder Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    guru,
  },
  async run({ $ }) {
    const options = await guru.propDefinitions.folderIds.options.call(this.guru);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
