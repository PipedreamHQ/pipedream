import apify from "../../apify.app.mjs";

export default {
  key: "apify-list-dataset-id-options",
  name: "List Dataset ID Options",
  description: "Retrieves available options for the Dataset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    apify,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await apify.propDefinitions.datasetId.options
        .call(this.apify, {
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
