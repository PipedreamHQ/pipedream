import launchnotes from "../../launchnotes.app.mjs";

export default {
  key: "launchnotes-list-project-id-options",
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
    launchnotes,
  },
  async run({ $ }) {
    const options = await launchnotes.propDefinitions.projectId.options.call(this.launchnotes);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
