import bolCom from "../../bol_com.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bol_com-create-return",
  name: "Create Return",
  description: "Create a return. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Returns/operation/create-return)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    orderId: {
      propDefinition: [
        bolCom,
        "orderId",
      ],
    },
    orderItemId: {
      propDefinition: [
        bolCom,
        "orderItemId",
        (c) => ({
          orderId: c.orderId,
        }),
      ],
    },
    quantityReturned: {
      type: "integer",
      label: "Quantity Returned",
      description: "The quantity of the order item that is being returned",
    },
    handlingResult: {
      type: "string",
      label: "Handling Result",
      description: "The handling result requested by the retailer",
      options: constants.HANDLING_RESULT_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.createReturn({
      $,
      data: {
        orderItemId: this.orderItemId,
        quantityReturned: this.quantityReturned,
        handlingResult: this.handlingResult,
      },
    });
    $.export("$summary", `Successfully created return: ${response.entityId}`);
    return response;
  },
};
