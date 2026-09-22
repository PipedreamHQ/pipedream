import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-list-asset-id-options",
  name: "List Asset ID Options",
  description: "Retrieves available options for the Asset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    alttextify,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await alttextify.propDefinitions.assetId.options
      .call(this.alttextify, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
