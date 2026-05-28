import { maestra } from "../../maestra.app.mjs";

export default {
  key: "maestra-list-file-id-options",
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
    maestra,
  },
  async run({ $ }) {
    const options = await maestra.propDefinitions.fileId.options.call(this.maestra, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
