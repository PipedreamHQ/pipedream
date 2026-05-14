import langfuse from "../../langfuse.app.mjs";

export default {
  key: "langfuse-list-project-id-options",
  name: "List Trace ID Options",
  description: "Retrieves available options for the Trace ID field.",
  version: "0.0.1",
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
