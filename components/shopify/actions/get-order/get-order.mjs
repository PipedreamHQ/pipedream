import common from "./common.mjs";
import app from "../../shopify.app.mjs";

export default {
  ...common, // spread the common configurations
  key: "shopify-get-order",
  name: "Get Order",
  description: "Retrieves a specific order from Shopify",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to retrieve",
    },
    ...common.props, // spread the common props
  },
  async run({ $ }) {
    const params = {
      fields: this.orderFields,
      include_metafields: this.includeMetafields,
      include_customer: this.includeCustomer,
      include_line_items: this.includeLineItems,
    };

    const response = await this.app.resourceAction(
      "order",
      "get",
      params,
      this.orderId
    );

    const formattedOrder = this.formatOrderData(response.result);
    $.export("$summary", `Retrieved order ${this.orderId}`);
    return formattedOrder;
  },
};
