import microsoft_excel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-list-folder-id-options",
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
    microsoft_excel,
  },
  async run({ $ }) {
    const options = await microsoft_excel.propDefinitions.folderId.options
      .call(this.microsoft_excel);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
