import getty_images from "../../getty_images.app.mjs";

export default {
  key: "getty_images-list-product-type-options",
  name: "List Product Type Options",
  description: "Retrieves available options for the Product Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getty_images,
  },
  async run({ $ }) {
    const options = await getty_images.propDefinitions.productType.options
      .call(this.getty_images, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
