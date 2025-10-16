import infusionsoft from "../../app/infusionsoft.app";
import { CreateOrderItemParams } from "../../types/requestParams";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Order Item",
  description:
    "Add an item to an existing order [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/createOrderItemsOnOrderUsingPOST)",
  key: "infusionsoft-create-order-item",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    orderId: {
      propDefinition: [
        infusionsoft,
        "orderId",
      ],
    },
    productId: {
      propDefinition: [
        infusionsoft,
        "productId",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      min: 1,
    },
    description: {
      type: "string",
      label: "Description",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description:
        "Overridable price of the product. If not specified, the default will be used. Must be greater than or equal to 0.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const params: CreateOrderItemParams = {
      $,
      orderId: this.orderId,
      data: {
        description: this.description,
        price: this.price,
        product_id: this.productId,
        quantity: this.quantity,
      },
    };

    const data: object = await this.infusionsoft.createOrderItem(params);

    $.export("$summary", "Created Order Item successfully");

    return data;
  },
});
