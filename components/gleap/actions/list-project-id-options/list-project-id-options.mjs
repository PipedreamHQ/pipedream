import gleap from "../../gleap.app.mjs";

export default {
  key: "gleap-list-project-id-options",
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
    gleap,
  },
  async run({ $ }) {
    const options = await gleap.propDefinitions.projectId.options.call(this.gleap);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
