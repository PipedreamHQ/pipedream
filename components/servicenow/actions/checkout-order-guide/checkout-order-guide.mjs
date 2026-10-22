import servicenow from "../../servicenow.app.mjs";
import {
  normalizeGuideCheckoutItems,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "servicenow-checkout-order-guide",
  name: "Checkout Order Guide",
  description: "Checkout a ServiceNow order guide using the items returned by **Submit Order Guide**. Pass those items as-is — this action maps `quantity` to `sysparm_quantity` and array `variables` (including nested `children`) to an object. Fill unanswered mandatory item variables in `items` first, and omit optional blank ones. If the order guide's Two step flag is on, this submits the order and returns the REQ number and `sys_id`, plus a `requested_items` array with each requested item's (RITM) `number`, `approval`, `stage`, `state` and `requested_for`; approvals happen on the RITMs, so read approval status there rather than on the REQ. If the flag is off, items are added to the user's default cart and no REQ is returned — review with **View Cart**, then call **Submit Cart Order**. Use **Check Order Status** after a REQ exists. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.1.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "guideSysId",
      ],
    },
    items: {
      propDefinition: [
        servicenow,
        "guideItems",
      ],
    },
  },
  async run({ $ }) {
    const items = normalizeGuideCheckoutItems(parseObject(this.items));

    const response = await this.servicenow.checkoutOrderGuide({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        items,
      },
    });

    const result = await this.servicenow.withRequestedItems({
      $,
      response,
    });
    const order = this.servicenow.describeOrder(result);
    $.export("$summary", order
      ? `Successfully checked out order guide ${this.catalogItemSysId}${order}`
      : `Order guide ${this.catalogItemSysId}: items added to cart; review with View Cart, then call Submit Cart Order`);

    return result;
  },
};
