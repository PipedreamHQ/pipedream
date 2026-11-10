import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-add-item-to-cart",
  name: "Add Item to Cart",
  description: "Add a ServiceNow catalog item to the current user's cart. Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. After adding items, use **View Cart**, then **Checkout Cart** or **Submit Cart Order** to submit. Leave `cartName` empty for that flow: those actions only work on the default cart. Set **Skip Mandatory Validation** only after **Get Catalog UI Policies** confirms every empty mandatory variable is hidden by a policy, never as a retry after a `Mandatory Variables are required` error: the item is added without those values and is submitted that way at checkout. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.2.0",
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
      description: "The `sys_id` of the catalog item to add. Run **Search Catalog Items** first to find this value. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
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
    cartName: {
      type: "string",
      label: "Cart Name",
      description: "Leave empty to use the user's default cart. Set it only when the named cart is checked out server-side, for example by a scripted REST API using `sn_sc.CartJS`: **View Cart**, **Checkout Cart** and **Submit Cart Order** cannot view or submit a named cart. Example: `cart_plan_42`.",
      optional: true,
    },
    skipMandatoryValidation: {
      propDefinition: [
        servicenow,
        "skipMandatoryValidation",
      ],
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
        ...(this.skipMandatoryValidation && {
          sysparm_no_validation: "true",
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
