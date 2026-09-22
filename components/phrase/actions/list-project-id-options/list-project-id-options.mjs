import phrase from "../../phrase.app.mjs";

export default {
  key: "phrase-list-project-id-options",
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
    phrase,
  },
  async run({ $ }) {
    const options = await phrase.propDefinitions.projectId.options.call(this.phrase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
