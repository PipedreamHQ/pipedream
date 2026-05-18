import ascora from "../../ascora.app.mjs";

export default {
  key: "ascora-list-customer-id-options",
  name: "List Customer ID Options",
  description: "Retrieves available options for the Customer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ascora,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await ascora.propDefinitions.customerId.options
        .call(this.ascora, {
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
