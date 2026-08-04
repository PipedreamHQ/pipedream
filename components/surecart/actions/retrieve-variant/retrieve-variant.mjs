import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-variant",
  name: "Retrieve Variant",
  description: "Retrieve a single variant by its ID. Run **List Variants** first to obtain a valid variant ID. [See the documentation](https://developer.surecart.com/api-reference/variants/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    variantId: {
      propDefinition: [
        surecart,
        "variantId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getVariant({
      $,
      variantId: this.variantId,
    });
    $.export("$summary", `Successfully retrieved variant ${this.variantId}`);
    return response;
  },
};
