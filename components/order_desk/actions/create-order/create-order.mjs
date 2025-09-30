import { getParsedOrderItems } from "../../common/validate-order-items.mjs";
import app  from "../../order_desk.app.mjs";

export default {
  name: "Create Order",
  description: "Create Order [See the documentation](https://apidocs.orderdesk.com/#create-an-order).",
  key: "order_desk-create-order",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    order_items: {
      propDefinition: [
        app,
        "order_items",
      ],
    },
    customer_first_name: {
      propDefinition: [
        app,
        "customer_first_name",
      ],
    },
    customer_last_name: {
      propDefinition: [
        app,
        "customer_last_name",
      ],
    },
    customer_company: {
      propDefinition: [
        app,
        "customer_company",
      ],
    },
    shipping_first_name: {
      propDefinition: [
        app,
        "shipping_first_name",
      ],
    },
    shipping_last_name: {
      propDefinition: [
        app,
        "shipping_last_name",
      ],
    },
    shipping_company: {
      propDefinition: [
        app,
        "shipping_company",
      ],
    },
    source_id: {
      propDefinition: [
        app,
        "source_id",
      ],
    },
    source_name: {
      propDefinition: [
        app,
        "source_name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    shipping_method: {
      propDefinition: [
        app,
        "shipping_method",
      ],
    },
    quantity_total: {
      propDefinition: [
        app,
        "quantity_total",
      ],
    },
    weight_total: {
      propDefinition: [
        app,
        "weight_total",
      ],
    },
    product_total: {
      propDefinition: [
        app,
        "product_total",
      ],
    },
    shipping_total: {
      propDefinition: [
        app,
        "shipping_total",
      ],
    },
    handling_total: {
      propDefinition: [
        app,
        "handling_total",
      ],
    },
    tax_total: {
      propDefinition: [
        app,
        "tax_total",
      ],
    },
    discount_total: {
      propDefinition: [
        app,
        "discount_total",
      ],
    },
    order_total: {
      propDefinition: [
        app,
        "order_total",
      ],
    },
    cc_number: {
      propDefinition: [
        app,
        "cc_number",
      ],
    },
    cc_exp: {
      propDefinition: [
        app,
        "cc_exp",
      ],
    },
    processor_response: {
      propDefinition: [
        app,
        "processor_response",
      ],
    },
    payment_type: {
      propDefinition: [
        app,
        "payment_type",
      ],
    },
    payment_status: {
      propDefinition: [
        app,
        "payment_status",
      ],
    },
    processor_balance: {
      propDefinition: [
        app,
        "processor_balance",
      ],
    },
    refund_total: {
      propDefinition: [
        app,
        "refund_total",
      ],
    },
    customer_id: {
      propDefinition: [
        app,
        "customer_id",
      ],
    },
    ip_address: {
      propDefinition: [
        app,
        "ip_address",
      ],
    },
    fulfillment_id: {
      propDefinition: [
        app,
        "fulfillment_id",
      ],
    },
    fulfillment_name: {
      propDefinition: [
        app,
        "fulfillment_name",
      ],
    },
    folder_id: {
      propDefinition: [
        app,
        "folder_id",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;

    const res = await app.createOrder({
      ...data,
      order_items: getParsedOrderItems(data.order_items),
    });
    $.export("summary", `Order successfully created with id "${res.order.id}".`);
    return res;
  },
};
