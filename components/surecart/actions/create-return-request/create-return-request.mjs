import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-return-request",
  name: "Create Return Request",
  description: "Create a new return request for an order. [See the documentation](https://developer.surecart.com/api-reference/return-requests/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    order: {
      propDefinition: [
        surecart,
        "orderId",
      ],
    },
    returnItems: {
      type: "string",
      label: "Return Items",
      description: "Items to return. Each item requires `line_item` (UUID), `quantity` (integer), and `return_reason_id` (one of: `color`, `defective`, `not_as_described`, `other`, `size_too_large`, `size_too_small`, `style`, `unknown`, `unwanted`, `wrong_item`). Include `note` when reason is `other`. Example: `[{ \"line_item\": \"li_abc123\", \"quantity\": 1, \"return_reason_id\": \"defective\" }]`",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata. Example: `{ \"source\": \"customer_portal\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createReturnRequest({
      $,
      data: {
        return_request: {
          order: this.order,
          return_items: this.returnItems
            ? JSON.parse(this.returnItems)
            : undefined,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created return request ${response.id}`);
    return response;
  },
};
