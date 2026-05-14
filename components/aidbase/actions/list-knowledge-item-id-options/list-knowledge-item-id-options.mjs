import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-list-knowledge-item-id-options",
  name: "List Knowledge Item ID Options",
  description: "Retrieves available options for the Knowledge Item ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aidbase,
  },
  async run({ $ }) {
    const options = await aidbase.propDefinitions.knowledgeItemId.options.call(this.aidbase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
