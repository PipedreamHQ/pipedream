import app from "../../picqer.app.mjs";

export default {
  key: "picqer-add-product-to-order",
  name: "Add Product To Order",
  description: "Adds a single product to concept orders only. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
        () => ({
          params: {
            status: "concept",
          },
        }),
      ],
    },
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The quantity of the product to add",
      default: 1,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the product",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the product",
      optional: true,
    },
    remarks: {
      type: "string",
      label: "Remarks",
      description: "Remarks for the product",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addProductToOrder({
      $,
      orderId: this.orderId,
      data: {
        idproduct: this.productId,
        amount: this.amount,
        price: this.price,
        name: this.name,
        remarks: this.remarks,
      },
    });

    $.export("$summary", `Successfully added product to order ${this.orderId}`);
    return response;
  },
};
