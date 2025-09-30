import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-create-order",
  name: "Create Order",
  description: "Creates a new order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-an-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woocommerce,
    status: {
      propDefinition: [
        woocommerce,
        "orderStatus",
      ],
    },
    customer: {
      propDefinition: [
        woocommerce,
        "customer",
      ],
    },
    paymentMethod: {
      propDefinition: [
        woocommerce,
        "paymentMethod",
      ],
    },
    products: {
      propDefinition: [
        woocommerce,
        "products",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.products) {
      for (const product of this.products) {
        props[`quantity${product.value}`] = {
          type: "integer",
          label: `Quantity of ${product.label}`,
          description: `Enter the quantity of ${product.label} for the new order`,
        };
      }
      return props;
    }
  },
  async run({ $ }) {
    const lineItems = this.products.map((product) => ({
      product_id: product.value,
      quantity: this[`quantity${product.value}`],
    }));
    const data = {
      status: this.status,
      customer_id: this.customer,
      payment_method: this.paymentMethod,
      line_items: lineItems,
    };
    const res = await this.woocommerce.createOrder(data);
    $.export("$summary", `Successfully created order ID: ${res.id}`);
    return res;
  },
};
