import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-file-url-options",
  name: "List File URL Options",
  description: "Retrieves available options for the File URL field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
  },
  async run({ $ }) {
    const options = await hubspot.propDefinitions.fileUrl.options.call(this.hubspot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
