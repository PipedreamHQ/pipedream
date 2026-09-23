import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-requested-items",
  name: "Get Requested Items",
  description: "Retrieve requested items (RITMs) from the `sc_req_item` table for a catalog request. Provide the request number returned by **Checkout Cart**, **Submit Cart Order**, **Order Catalog Item**, or **Checkout Order Guide**. Use this after checkout to get RITM numbers and states for follow-up links. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    requestNumber: {
      propDefinition: [
        servicenow,
        "requestNumber",
      ],
      optional: true,
    },
    requestSysId: {
      type: "string",
      label: "Request Sys ID",
      description: "Optional `sys_id` of the parent `sc_request` (matched against `request`). Use `sys_id` / `request_id` from **Checkout Cart**, **Submit Cart Order**, or **Checkout Order Guide**. Example: `a9e9c33dc61122760072455df62663d2`.",
      optional: true,
    },
    ritmNumber: {
      type: "string",
      label: "RITM Number",
      description: "Optional requested-item number (matched against `number` on `sc_req_item`). Use `number` from a previous **Get Requested Items** run. Example: `RITM0010001`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.requestNumber, "Request Number");
    assertSafeQueryValue(this.requestSysId, "Request Sys ID");
    assertSafeQueryValue(this.ritmNumber, "RITM Number");

    const queryParts = [];
    if (this.requestNumber) {
      queryParts.push(`request.number=${this.requestNumber}`);
    }
    if (this.requestSysId) {
      queryParts.push(`request=${this.requestSysId}`);
    }
    if (this.ritmNumber) {
      queryParts.push(`number=${this.ritmNumber}`);
    }
    if (!queryParts.length) {
      throw new ConfigurationError("Provide a Request Number, Request Sys ID, or RITM Number.");
    }

    const response = await this.servicenow.getRequestedItems({
      $,
      params: {
        sysparm_query: queryParts.join("^"),
        sysparm_limit: this.limit,
      },
    });

    const items = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Retrieved ${items.length} requested item(s)`);

    return response;
  },
};
