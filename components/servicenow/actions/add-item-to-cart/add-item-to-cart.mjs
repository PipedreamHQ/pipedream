import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-add-item-to-cart",
  name: "Add Item to Cart",
  description: "Add a ServiceNow catalog item to the current user's cart. Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. After adding items, use **View Cart**, then **Checkout Cart** or **Custom Checkout Cart** to submit. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      type: "string",
      label: "Catalog Item Sys ID",
      description: "The `sys_id` of the catalog item to add. Run **Search Catalog Items** first to find this value.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Quantity to add (maps to `sysparm_quantity`). Min 1. Example: `1`.",
      min: 1,
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "JSON object of variable name-value pairs for the item. Run **Get Catalog Item Variables** to discover valid names. Example: `{\"justification\": \"new hire\", \"model\": \"abc123\"}`.",
      optional: true,
    },
    requestedFor: {
      type: "string",
      label: "Requested For",
      description: "Optional `sys_id` of the user this item is requested for (maps to `sysparm_requested_for`). Run **Lookup User by Name** or **Get User by Email** to find it.",
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
      },
    });

    $.export("$summary", `Successfully added catalog item ${this.catalogItemSysId} to cart`);

    return response;
  },
};
