import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-variant",
  name: "Delete Variant",
  description: "Delete a variant by ID. [See the documentation](https://developer.surecart.com/api-reference/variants/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.surecart.deleteVariant({
      $,
      variantId: this.variantId,
    });
    $.export("$summary", `Successfully deleted variant ${this.variantId}`);
    return response;
  },
};
