import app from "../../baselinker.app.mjs";
import method from "../../common/method.mjs";

export default {
  key: "baselinker-delete-inventory-product",
  name: "Delete Inventory Product",
  description: "It allows you to remove the product from BaseLinker catalog. [See the Documentation](https://api.baselinker.com/index.php?method=deleteInventoryProduct).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    inventoryId: {
      propDefinition: [
        app,
        "inventoryId",
      ],
    },
    productId: {
      propDefinition: [
        app,
        "productId",
        ({ inventoryId }) => ({
          inventoryId,
        }),
      ],
    },
  },
  methods: {
    deleteInventoryProduct(args = {}) {
      return this.app.connector({
        ...args,
        data: {
          method: method.DELETE_INVENTORY_PRODUCT,
          ...args.data,
        },
      });
    },
  },
  async run({ $: step }) {
    const {
      inventoryId,
      productId,
    } = this;

    const response = await this.deleteInventoryProduct({
      data: {
        parameters: {
          inventory_id: inventoryId,
          product_id: productId,
        },
      },
    });

    step.export("$summary", `Successfully deleted product ${productId} from inventory ${inventoryId}.`);

    return response;
  },
};
