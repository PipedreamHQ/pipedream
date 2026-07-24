import servicenow from "../../servicenow.app.mjs";

// The cart response returns line items either as a flat `items` array or grouped
// under recurring-frequency buckets (e.g. `one_time.items`, `monthly.items`,
// `yearly.items`). Collect items from every bucket that exposes an `items` array.
function collectCartItems(cart) {
  if (!cart || typeof cart !== "object") {
    return [];
  }
  const items = [];
  if (Array.isArray(cart.items)) {
    items.push(...cart.items);
  }
  for (const value of Object.values(cart)) {
    if (value && typeof value === "object" && !Array.isArray(value) && Array.isArray(value.items)) {
      items.push(...value.items);
    }
  }
  return items;
}

export default {
  key: "servicenow-view-cart",
  name: "View Cart",
  description: "Retrieve the current user's ServiceNow cart contents, including the `cart_item` ids needed by **Delete Cart Item**. Use before **Checkout Cart** or **Submit Cart Order** to confirm what will be ordered. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
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

    const cartItems = collectCartItems(response);
    $.export("$summary", `Retrieved cart with ${cartItems.length} item(s)`);

    return response;
  },
};
