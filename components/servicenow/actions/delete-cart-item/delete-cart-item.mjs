import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-delete-cart-item",
  name: "Delete Cart Item",
  description: "Remove an item from the current user's ServiceNow cart. Run **View Cart** first to obtain the `cart_item` id to delete. This permanently removes the line item from the cart. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    servicenow,
    cartItemId: {
      type: "string",
      label: "Cart Item ID",
      description: "The cart item id to remove. Run **View Cart** first to find this value. Example: `0f3b2e2e1b223010d3f5a6c1cd4bcb12`.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.deleteCartItem({
      $,
      cartItemId: this.cartItemId,
    });

    $.export("$summary", `Successfully removed cart item ${this.cartItemId}`);

    return response;
  },
};
