import { parseObject } from "../../common/utils.mjs";
import printify from "../../printify.app.mjs";

export default {
  key: "printify-create-product",
  name: "Create a Product",
  description: "Creates a new product on Printify. [See the documentation](https://developers.printify.com/#create-a-new-product)",
  version: "0.0.1",
  type: "action",
  props: {
    printify,
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    title: {
      propDefinition: [
        printify,
        "title",
      ],
    },
    description: {
      propDefinition: [
        printify,
        "description",
      ],
    },
    tags: {
      propDefinition: [
        printify,
        "tags",
      ],
      optional: true,
    },
    blueprintId: {
      propDefinition: [
        printify,
        "blueprintId",
      ],
    },
    printAreas: {
      propDefinition: [
        printify,
        "printAreas",
      ],
    },
    variants: {
      propDefinition: [
        printify,
        "variants",
      ],
    },
    printProviderId: {
      propDefinition: [
        printify,
        "printProviderId",
        ({ blueprintId }) => ({
          blueprintId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.printify.createProduct({
      shopId: this.shopId,
      data: {
        title: this.title,
        description: this.description,
        tags: this.tags,
        blueprint_id: this.blueprintId,
        print_provider_id: this.printProviderId,
        print_areas: parseObject(this.printAreas),
        variants: parseObject(this.variants),
      },
    });

    $.export("$summary", `Successfully created a new product with ID: ${response.id}`);
    return response;
  },
};
