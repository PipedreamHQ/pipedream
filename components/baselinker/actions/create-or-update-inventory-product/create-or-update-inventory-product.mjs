import app from "../../baselinker.app.mjs";
import method from "../../common/method.mjs";

export default {
  key: "baselinker-create-or-update-inventory-product",
  name: "Create Or Update Inventory Product",
  description: "It allows you to add a new product to BaseLinker catalog. Entering the product with the ID updates previously saved product. [See the Documentation](https://api.baselinker.com/index.php?method=addInventoryProduct).",
  type: "action",
  version: "0.0.6",
  props: {
    app,
    inventoryId: {
      propDefinition: [
        app,
        "inventoryId",
      ],
    },
    name: {
      type: "string",
      label: "Product Name",
      description: "The name of the product.",
    },
    description: {
      type: "string",
      label: "Product Description",
      description: "The description of the product.",
      optional: true,
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "The SKU of the product.",
      optional: true,
    },
  },
  methods: {
    createOrUpdateInventoryProduct(args = {}) {
      return this.app.connector({
        ...args,
        data: {
          method: method.ADD_INVENTORY_PRODUCT,
          ...args.data,
        },
      });
    },
  },
  async run({ $: step }) {
    const {
      inventoryId,
      name,
      description,
      sku,
    } = this;

    const response = await this.createOrUpdateInventoryProduct({
      step,
      data: {
        parameters: {
          inventory_id: inventoryId,
          sku,
          text_fields: {
            name,
            description,
          },
        },
      },
    });

    if (response.status !== "SUCCESS") {
      step.export("$summary", "Failed to create or update inventory product.");
      return response;
    }

    step.export("$summary", `Successfully created or updated inventory product with ID ${response.product_id}`);

    return response;
  },
};
