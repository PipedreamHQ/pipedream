import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-order-catalog-item",
  name: "Order Catalog Item",
  description: "Place a one-step Order Now request for a single ServiceNow catalog item, bypassing the cart. Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. Use **Check Order Status** afterward to track the resulting request. Returns the request (REQ) plus a `requested_items` array with each requested item's (RITM) `number`, `approval`, `stage`, `state` and `requested_for`; approvals happen on the RITMs, so read approval status there rather than on the REQ. If `Requested For` was set but ServiceNow assigned the items to someone else, the result includes a `requested_for_warning`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
        "catalogItemSysId",
      ],
      description: "The `sys_id` of the catalog item to order. Run **Search Catalog Items** first to find this value. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
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
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.orderNow({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        sysparm_quantity: this.quantity,
        variables: parseObject(this.variables),
        sysparm_requested_for: this.requestedFor,
      },
    });

    const result = await this.servicenow.withRequestedItems({
      $,
      response,
      requestedFor: this.requestedFor,
    });
    $.export("$summary", `Successfully ordered catalog item ${this.catalogItemSysId}${this.servicenow.describeOrder(result)}`);

    return result;
  },
};
