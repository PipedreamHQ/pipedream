import pinecone from "../../pinecone.app.mjs";

export default {
  key: "pinecone-list-index-name-options",
  name: "List Index Name Options",
  description: "Retrieves available options for the Index Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pinecone,
  },
  async run({ $ }) {
    const options = await pinecone.propDefinitions.indexName.options.call(this.pinecone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
