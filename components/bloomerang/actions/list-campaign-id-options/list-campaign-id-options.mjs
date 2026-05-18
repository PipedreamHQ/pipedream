import bloomerang from "../../bloomerang.app.mjs";

export default {
  key: "bloomerang-list-campaign-id-options",
  name: "List Campaign Options",
  description: "Retrieves available options for the Campaign field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bloomerang,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bloomerang.propDefinitions.campaignId.options
        .call(this.bloomerang, {
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
