import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-order-catalog-item",
  name: "Order Catalog Item",
  description: "Place a Service Catalog order. Triggers the full fulfillment workflow (approvals, tasks, SLAs) and creates a `sc_request` (REQ) and one or more `sc_req_item` (RITM) records."
    + " **When to use:** the caller wants to order a laptop, phone, software license, access grant, or any orderable Service Catalog item (`type: catalog_item`). For record producers (type: `record_producer`), use **Submit Record Producer** instead."
    + " **Returns:** `{ request_number, request_id, sys_id, table }` where `request_number` is the REQ number and the response also references the RITM record(s)."
    + " **Cross-references:** ALWAYS call **Get Catalog Item** first to fetch the item's `variables` schema — you need to know which variables are mandatory, their types, reference tables, and valid choice values before you can submit a valid payload."
    + " **Parameter guidance:** `variables` is a JSON object of variable `name` → value pairs (not `label` → value). Example: `{\"quantity\":\"1\",\"hardware_model\":\"Standard Laptop\",\"business_justification\":\"New hire\"}`. Reference variables take the referenced record's `sys_id`; choice variables take the option value."
    + " **Common mistakes:** use variable `name`, not `label`. Don't include variables outside the schema returned by **Get Catalog Item** — they'll be silently dropped or fail validation."
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
