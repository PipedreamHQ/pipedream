import action from "@pipedream/servicenow/actions/add-item-to-cart/add-item-to-cart.mjs";
import { parseObject } from "@pipedream/servicenow/common/utils.mjs";
import { wrapAction } from "../../common/utils.mjs";

const actionWithCartName = {
  ...action,
  props: {
    ...action.props,
    cartName: {
      type: "string",
      label: "Cart Name",
      description: "Leave empty to use the integration user's default cart. Set it only when the named cart is checked out server-side, for example by a scripted REST API using `sn_sc.CartJS` that runs as the same integration user: **View Cart**, **Checkout Cart** and **Submit Cart Order** cannot view or submit a named cart. Example: `cart_plan_42`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const cartName = this.cartName?.trim();
    const response = await this.servicenow.addItemToCart({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        sysparm_quantity: this.quantity,
        variables: parseObject(this.variables),
        sysparm_requested_for: this.requestedFor,
        ...(cartName && {
          sysparm_cart_name: cartName,
        }),
      },
    });

    const cart = cartName
      ? `cart ${cartName}`
      : "cart";
    $.export("$summary", `Successfully added catalog item ${this.catalogItemSysId} to ${cart}`);

    return response;
  },
};

export default wrapAction(actionWithCartName, {
  key: "servicenow_service_account-add-item-to-cart",
  version: "0.1.1",
  description: "Add a ServiceNow catalog item to the integration user's cart (one cart shared by every session of this integration user, so concurrent sessions can add, remove, or submit each other's items). Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. After adding items, use **View Cart**, then **Checkout Cart** or **Submit Cart Order** to submit. Leave `cartName` empty for that flow: those actions only work on the default cart. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
});
