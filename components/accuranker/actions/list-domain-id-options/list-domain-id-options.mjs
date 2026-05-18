import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-domain-id-options",
  name: "List Domain ID Options",
  description: "Retrieves available options for the Domain ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accuranker,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await accuranker.propDefinitions.domainId.options
        .call(this.accuranker, {
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
