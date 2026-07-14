import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-return-request",
  name: "Update Return Request",
  description: "Update an existing return request. [See the documentation](https://developer.surecart.com/api-reference/return-requests/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    returnRequestId: {
      propDefinition: [
        surecart,
        "returnRequestId",
      ],
    },
    order: {
      propDefinition: [
        surecart,
        "orderId",
      ],
    },
    returnItems: {
      type: "string",
      label: "Return Items",
      description: "Updated return items. Each item requires `line_item` (UUID), `quantity` (integer, must not exceed fulfilled quantity), and `return_reason` (one of: `color`, `defective`, `not_as_described`, `other`, `size_too_large`, `size_too_small`, `style`, `unknown`, `unwanted`, `wrong_item`). Include `note` when reason is `other`. Example: `[{\"line_item\":\"li_abc123\",\"quantity\":1,\"return_reason\":\"other\",\"note\":\"Item arrived damaged\"}]`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Updated key-value metadata. Example: `{ \"source\": \"customer_portal\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateReturnRequest({
      $,
      returnRequestId: this.returnRequestId,
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
    $.export("$summary", `Successfully updated return request ${this.returnRequestId}`);
    return response;
  },
};
