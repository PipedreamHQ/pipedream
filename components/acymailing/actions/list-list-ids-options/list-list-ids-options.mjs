import acymailing from "../../acymailing.app.mjs";

export default {
  key: "acymailing-list-list-ids-options",
  name: "List List Ids Options",
  description: "Retrieves available options for the List Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acymailing,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await acymailing.propDefinitions.listIds.options
        .call(this.acymailing, {
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
