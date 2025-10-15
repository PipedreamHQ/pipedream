import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-get-purchase-order",
  name: "Get Purchase Order",
  description: "Get a purchase order by ID. [See the documentation](https://apidocs.unleashedsoftware.com/Purchases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unleashedSoftware,
    purchaseOrderId: {
      propDefinition: [
        unleashedSoftware,
        "purchaseOrderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.unleashedSoftware.getPurchaseOrder({
      $,
      purchaseOrderId: this.purchaseOrderId,
    });

    $.export("$summary", `Successfully retrieved purchase order with ID ${this.purchaseOrderId}`);
    return response;
  },
};
