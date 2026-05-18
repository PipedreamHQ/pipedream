import apollo_io from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-list-opportunity-id-options",
  name: "List Opportunity ID Options",
  description: "Retrieves available options for the Opportunity ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    apollo_io,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await apollo_io.propDefinitions.opportunityId.options
        .call(this.apollo_io, {
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
