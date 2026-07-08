import langfuse from "../../langfuse.app.mjs";

export default {
  key: "langfuse-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    langfuse,
  },
  async run({ $ }) {
    const options = await langfuse.propDefinitions.projectId.options.call(this.langfuse);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
