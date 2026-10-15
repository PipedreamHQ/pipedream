import servicenow from "../../servicenow.app.mjs";
import {
  assertSysId,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "servicenow-update-cart-item",
  name: "Update Cart Item",
  description: "Updates quantity, requested-for, and variable values on an existing ServiceNow cart item. Attachment variables must contain the `sys_id` returned by **Upload Attachment**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    cartItemId: {
      type: "string",
      label: "Cart Item Sys ID",
      description: "The 32-character `cart_item_id` returned by **Add Item to Cart** or **Submit Order Guide**. Example: `46a1c7d2e8f94b6c9a0d1e2f3a4b5c6d`.",
    },
    quantity: {
      propDefinition: [
        servicenow,
        "quantity",
      ],
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
      description: "Complete JSON object of variable name-value pairs. For a File Attachment variable, use the attachment `sys_id` returned by **Upload Attachment**. Example: `{\"evidence\": \"46a1c7d2e8f94b6c9a0d1e2f3a4b5c6d\"}`.",
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
  },
  async run({ $ }) {
    const cartItemId = assertSysId(this.cartItemId, "Cart Item Sys ID", {
      trim: true,
    });
    const variables = parseObject(this.variables) ?? {};
    const response = await this.servicenow.updateCartItem({
      $,
      cartItemId,
      data: {
        sysparm_quantity: this.quantity,
        variables,
        ...(this.requestedFor && {
          sysparm_requested_for: this.requestedFor,
        }),
      },
    });

    $.export("$summary", `Successfully updated cart item ${cartItemId}`);
    return {
      ...(response && typeof response === "object"
        ? response
        : {
          result: response,
        }),
      cart_item_id: cartItemId,
    };
  },
};
