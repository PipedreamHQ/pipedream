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
      description: "Add to the integration user's named cart with this name instead of their default cart. Example: `cart_plan_42`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.addItemToCart({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        sysparm_quantity: this.quantity,
        variables: parseObject(this.variables),
        sysparm_requested_for: this.requestedFor,
        sysparm_cart_name: this.cartName,
      },
    });

    const cart = this.cartName
      ? `cart ${this.cartName}`
      : "cart";
    $.export("$summary", `Successfully added catalog item ${this.catalogItemSysId} to ${cart}`);

    return response;
  },
};

export default wrapAction(actionWithCartName, {
  key: "servicenow_service_account-add-item-to-cart",
  version: "0.1.0",
  description: "Add a ServiceNow catalog item to the integration user's default cart, or to a named cart when `cartName` is set. The default cart is one cart shared by every session of this integration user, so concurrent sessions can add, remove, or submit each other's items; a named cart per session keeps them apart. Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. After adding items to the default cart, use **View Cart**, then **Checkout Cart** or **Submit Cart Order** to submit. Those actions take no cart name, so they cannot view or submit a named cart. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
});
