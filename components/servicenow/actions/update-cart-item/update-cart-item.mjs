import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

const SYS_ID_PATTERN = /^[0-9a-f]{32}$/i;

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
      description: "The 32-character `cart_item_id` returned by **Add Item to Cart** or **Submit Order Guide**.",
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
      description: "Complete JSON object of variable name-value pairs. For a File Attachment variable, use the attachment `sys_id` returned by **Upload Attachment**.",
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
  },
  async run({ $ }) {
    const cartItemId = String(this.cartItemId ?? "").trim();
    if (!SYS_ID_PATTERN.test(cartItemId)) {
      throw new ConfigurationError("Cart Item Sys ID must be a 32-character hexadecimal sys_id.");
    }
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
