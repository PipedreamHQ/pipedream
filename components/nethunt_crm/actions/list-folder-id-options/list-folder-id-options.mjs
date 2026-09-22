import nethunt_crm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-list-folder-id-options",
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
    nethunt_crm,
  },
  async run({ $ }) {
    const options = await nethunt_crm.propDefinitions.folderId.options.call(this.nethunt_crm);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
