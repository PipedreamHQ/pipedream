import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-list-knowledge-base-id-options",
  name: "List Knowledge Base ID Options",
  description: "Retrieves available options for the Knowledge Base ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vectorshift,
  },
  async run({ $ }) {
    const options = await vectorshift.propDefinitions.knowledgeBaseId.options
      .call(this.vectorshift, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
