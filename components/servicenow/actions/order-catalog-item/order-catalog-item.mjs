import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-order-catalog-item",
  name: "Order Catalog Item",
  description: "Orders a standard item from the ServiceNow service catalog (e.g., laptops, equipment, software licenses)."
    + " For record producer catalog items (e.g., VPN access requests, HR cases), use **Submit Record Producer** instead."
    + " [See the documentation](https://docs.servicenow.com/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sysId: {
      type: "string",
      label: "Catalog Item sys_id",
      description: "`sys_id` of the catalog item to order. Get this from **List Catalog Items**.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Number of units to order.",
      min: 1,
      default: 1,
      optional: true,
    },
    variables: {
      type: "string",
      label: "Variables",
      description: "JSON object of variable `name` → value pairs per the item's form schema. Example: `{\"hardware_model\":\"Standard Laptop\",\"business_justification\":\"New hire\"}`. Use **Get Catalog Item** to discover the schema.",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = parseObject(this.variables) ?? {};

    const result = await this.app.orderCatalogItem({
      $,
      sysId: this.sysId,
      data: {
        sysparm_quantity: String(this.quantity ?? 1),
        variables,
      },
    });

    const reqNumber = result?.request_number || result?.number || "(unknown)";
    $.export("$summary", `Placed order — ${reqNumber}`);

    return result ?? {};
  },
};
