import document360 from "../../document360.app.mjs";

export default {
  key: "document360-list-project-version-id-options",
  name: "List Project Version ID Options",
  description: "Retrieves available options for the Project Version ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    document360,
  },
  async run({ $ }) {
    const options = await document360.propDefinitions.projectVersionId.options
      .call(this.document360);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
