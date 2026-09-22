import qdrant from "../../qdrant.app.mjs";

export default {
  key: "qdrant-list-collection-name-options",
  name: "List Collection Name Options",
  description: "Retrieves available options for the Collection Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    qdrant,
  },
  async run({ $ }) {
    const options = await qdrant.propDefinitions.collectionName.options.call(this.qdrant);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
