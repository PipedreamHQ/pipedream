import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-list-category-id-options",
  name: "List Category Id Options",
  description: "Retrieves available options for the Category Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bigcommerce,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bigcommerce.propDefinitions.categoryId.options
        .call(this.bigcommerce, {
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
