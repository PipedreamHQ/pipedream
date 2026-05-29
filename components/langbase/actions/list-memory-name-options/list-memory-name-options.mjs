import langbase from "../../langbase.app.mjs";

export default {
  key: "langbase-list-memory-name-options",
  name: "List Memory Name Options",
  description: "Retrieves available options for the Memory Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    langbase,
  },
  async run({ $ }) {
    const options = await langbase.propDefinitions.memoryName.options.call(this.langbase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
