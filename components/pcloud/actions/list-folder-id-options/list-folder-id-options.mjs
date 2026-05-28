import { pcloud } from "../../pcloud.app.mjs";

export default {
  key: "pcloud-list-folder-id-options",
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
    pcloud,
  },
  async run({ $ }) {
    const options = await pcloud.propDefinitions.folderId.options.call(this.pcloud, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
