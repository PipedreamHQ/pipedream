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
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await alttextify.propDefinitions.assetId.options
        .call(this.alttextify, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
