import curated from "../../curated.app.mjs";

export default {
  key: "curated-list-publication-id-options",
  name: "List Publication ID Options",
  description: "Retrieves available options for the Publication ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    curated,
  },
  async run({ $ }) {
    const options = await curated.propDefinitions.publicationId.options.call(this.curated);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
