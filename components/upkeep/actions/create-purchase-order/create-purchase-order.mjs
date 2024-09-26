import common from "../common/common-purchase-order.mjs";

export default {
  type: "action",
  key: "upkeep-create-purchase-order",
  version: "0.0.2",
  name: "Create Purchase Order",
  description: "Create a Purchase Order, [See the docs](https://developers.onupkeep.com/#purchase-orders)",
  ...common,
  props: {
    app: common.props.app,
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
    },
    ...common.props,
  },
  async run ({ $ }) {
    const { result } = await this.app.createPurchaseOrder({
      $,
      data: this.prepareData(),
    });
    $.export("$summary", `Purchase order with ID ${result.id} has been created.`);
    return result;
  },
};
