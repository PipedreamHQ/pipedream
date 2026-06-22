import microsoft_onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-list-shared-folder-reference-options",
  name: "List Shared Folder Reference Options",
  description: "Retrieves available options for the Shared Folder Reference field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_onedrive,
  },
  async run({ $ }) {
    const options = await microsoft_onedrive.propDefinitions.sharedFolderReference.options
      .call(this.microsoft_onedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
