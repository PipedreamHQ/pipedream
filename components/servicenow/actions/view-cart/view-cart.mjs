import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-view-cart",
  name: "View Cart",
  description: "Retrieve the current user's ServiceNow cart contents, including the `cart_item` ids needed by **Delete Cart Item**. Use before **Checkout Cart** or **Custom Checkout Cart** to confirm what will be ordered. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
  },
  async run({ $ }) {
    const response = await this.servicenow.getCart({
      $,
    });

    const cartItems = response?.cart_items ?? [];
    $.export("$summary", `Retrieved cart with ${cartItems.length} item(s)`);

    return response;
  },
};
