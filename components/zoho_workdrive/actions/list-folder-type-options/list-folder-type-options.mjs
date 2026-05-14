import zoho_workdrive from "../../zoho_workdrive.app.mjs";

export default {
  key: "zoho_workdrive-list-folder-type-options",
  name: "List Folder Type Options",
  description: "Retrieves available options for the Folder Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_workdrive,
  },
  async run({ $ }) {
    const options = await zoho_workdrive.propDefinitions.folderType.options
      .call(this.zoho_workdrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
