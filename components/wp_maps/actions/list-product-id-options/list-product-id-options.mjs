import wp_maps from "../../wp_maps.app.mjs";

export default {
  key: "wp_maps-list-product-id-options",
  name: "List Product ID Options",
  description: "Retrieves available options for the Product ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wp_maps,
  },
  async run({ $ }) {
    const options = await wp_maps.propDefinitions.productId.options.call(this.wp_maps, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
