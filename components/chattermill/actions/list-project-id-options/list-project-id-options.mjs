import chattermill from "../../chattermill.app.mjs";

export default {
  key: "chattermill-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chattermill,
  },
  async run({ $ }) {
    const options = await chattermill.propDefinitions.projectId.options.call(this.chattermill);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
