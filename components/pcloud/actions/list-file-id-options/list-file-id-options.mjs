import pcloud from "../../pcloud.app.mjs";

export default {
  key: "pcloud-list-file-id-options",
  name: "List File ID Options",
  description: "Retrieves available options for the File ID field.",
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
    const options = await pcloud.propDefinitions.fileId.options.call(this.pcloud, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
