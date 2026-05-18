import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-list-product-model-code-options",
  name: "List Product Model Code Options",
  description: "Retrieves available options for the Product Model Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    akeneo,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await akeneo.propDefinitions.productModelCode.options
        .call(this.akeneo, {
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
