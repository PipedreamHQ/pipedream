import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-create-new-order",
  name: "Create New Order",
  description: "Create a new order. [See the documentation](https://app.mailbluster.com/api-doc/orders)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailbluster,
    id: {
      type: "string",
      label: "Id",
      description: "Unique ID of the order",
    },
    email: {
      type: "string",
      label: "Customer Email",
      description: "If no lead is found associated to this email, we will create a lead using this email address, otherwise will use the existing one",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency code of the order. For Example: USD, AUD",
    },
    totalPrice: {
      type: "string",
      label: "Total Price",
      description: "The total price of the order, eg: 10.64",
    },
    products: {
      propDefinition: [
        mailbluster,
        "productId",
      ],
      type: "string[]",
      label: "Products",
      description: "The products to include in the order",
      withLabel: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.products?.length) {
      for (const product of this.products) {
        props[`price_${product.value}`] = {
          type: "string",
          label: `Price of ${product.label}`,
          description: "The price of the product",
        };
        props[`quantity_${product.value}`] = {
          type: "string",
          label: `Quantity of ${product.label}`,
          description: "The quantity of the product",
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const items = this.products.map(({
      label, value,
    }) => ({
      id: value,
      name: label,
      price: +this[`price_${value}`],
      quantity: +this[`quantity_${value}`],
    }));

    const data = {
      id: this.id,
      customer: {
        email: this.email,
      },
      currency: this.currency,
      totalPrice: +this.totalPrice,
      items,
    };
    const response = await this.mailbluster.createOrder({
      $,
      data,
    });

    $.export("$summary", `Order with ID ${data.id} was successfully created!`);
    return response;
  },
};
