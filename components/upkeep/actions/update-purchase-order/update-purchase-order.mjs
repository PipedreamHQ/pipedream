import common from "../common/common-purchase-order.mjs";

export default {
  type: "action",
  key: "upkeep-update-purchase-order",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Purchase Order",
  description: "Update a Purchase Order, [See the docs](https://developers.onupkeep.com/#update-a-specific-purchase-order)",
  ...common,
  props: {
    app: common.props.app,
    purchaseOrderId: {
      propDefinition: [
        common.props.app,
        "purchaseOrderId",
      ],
    },
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
      optional: true,
    },
    ...common.props,
  },
  async run ({ $ }) {
    const { result } = await this.app.updatePurchaseOrder({
      $,
      purchaseOrderId: this.purchaseOrderId,
      data: this.prepareData(),
    });
    $.export("$summary", `Purchase order with ID ${result.id} has been updated.`);
    return result;
  },
};
