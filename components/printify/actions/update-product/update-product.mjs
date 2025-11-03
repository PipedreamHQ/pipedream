import { parseObject } from "../../common/utils.mjs";
import printify from "../../printify.app.mjs";

export default {
  key: "printify-update-product",
  name: "Update Product",
  description: "Updates an existing product on Printify. [See the documentation](https://developers.printify.com/#update-a-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printify,
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    productId: {
      propDefinition: [
        printify,
        "productId",
        ({ shopId }) => ({
          shopId,
        }),
      ],
    },
    title: {
      propDefinition: [
        printify,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        printify,
        "description",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        printify,
        "tags",
      ],
      optional: true,
    },
    printAreas: {
      propDefinition: [
        printify,
        "printAreas",
      ],
      optional: true,
    },
    variants: {
      propDefinition: [
        printify,
        "variants",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printify.updateProduct({
      shopId: this.shopId,
      productId: this.productId,
      data: {
        title: this.title,
        description: this.description,
        tags: this.tags,
        print_areas: parseObject(this.printAreas),
        variants: parseObject(this.variants),
      },
    });

    $.export("$summary", `Successfully updated product with ID: ${this.productId}`);
    return response;
  },
};
