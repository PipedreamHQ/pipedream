import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-order-catalog-item",
  name: "Order Catalog Item",
  description: "Orders a standard item from the ServiceNow service catalog (e.g., laptops, equipment, software licenses). For record producer catalog items (e.g., VPN access requests, HR cases), use submit-record-producer instead.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sys_id: {
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

    const body = {
      sysparm_quantity: String(this.quantity ?? 1),
      variables,
    };

    const response = await axios($, {
      method: "POST",
      url: `${this.app.baseUrl()}/api/sn_sc/servicecatalog/items/${this.sys_id}/order_now`,
      headers: {
        ...this.app.authHeaders(),
        "Content-Type": "application/json",
      },
      data: body,
    });

    const result = response.result ?? {};
    const reqNumber = result.request_number || result.number || "(unknown)";
    $.export("$summary", `Placed order — ${reqNumber}`);

    return result;
  },
};
