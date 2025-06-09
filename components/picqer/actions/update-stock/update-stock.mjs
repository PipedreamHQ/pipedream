import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-update-stock",
  name: "Update Product Stock",
  description: "Update the stock level of a product in a specific warehouse. [See the documentation](https://picqer.com/en/api)",
  version: "0.0.1",
  type: "action",
  props: {
    picqer,
    productCode: {
      propDefinition: [
        picqer,
        "productCode",
      ],
    },
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
    },
    stock: {
      type: "integer",
      label: "Stock Level",
      description: "The new stock level for the product in the specified warehouse.",
    },
  },
  async run({ $ }) {
    const response = await this.picqer.updateProductStock({
      productCode: this.productCode,
      warehouseId: this.warehouseId,
      stock: this.stock,
    });

    $.export("$summary", `Successfully updated the stock for product ${this.productCode} in warehouse ${this.warehouseId}`);
    return response;
  },
};
