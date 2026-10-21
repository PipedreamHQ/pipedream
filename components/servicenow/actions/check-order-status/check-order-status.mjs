import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-check-order-status",
  name: "Check Order Status",
  description: "Retrieve the status of a ServiceNow catalog request (REQ) from the `sc_request` table, with its requested items (RITMs) under `requested_items` (`number`, `approval`, `stage`, `state`, `requested_for`). Approvals happen on the RITMs: the REQ's own `approval` can read `approved` while a RITM is still waiting, so report approval status from `requested_items[].approval`. Provide the request number returned by **Checkout Cart**, **Submit Cart Order**, **Order Catalog Item**, or **Checkout Order Guide**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.1.1",
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
      type: "string",
      label: "Request Number",
      description: "The request number to look up (matched against `number` on `sc_request`). Example: `REQ0010001`.",
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
      description: "Optional `sys_id` of the requested-for user to additionally filter by (matched against `requested_for` on `sc_request`). Run **Find Users** to find it.",
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.requestNumber, "Request Number");
    assertSafeQueryValue(this.requestedFor, "Requested For");

    const queryParts = [
      `number=${this.requestNumber}`,
    ];
    if (this.requestedFor) {
      queryParts.push(`requested_for=${this.requestedFor}`);
    }
    const response = await this.servicenow.getRequests({
      $,
      params: {
        sysparm_query: queryParts.join("^"),
        sysparm_limit: 1,
      },
    });

    const request = response?.[0];
    if (!request) {
      $.export("$summary", `No request found with number ${this.requestNumber}`);
      return response;
    }

    if (!request.sys_id) {
      throw new Error(`Request ${this.requestNumber} was returned without a sys_id, so its requested items cannot be retrieved.`);
    }

    const requestedItems = await this.servicenow.getRequestedItemsForRequest({
      $,
      requestId: request.sys_id,
    });
    const state = request.state ?? request.request_state;
    const itemStatus = requestedItems.map(({
      number, approval, stage,
    }) => `${number}: approval ${approval || "unknown"}, stage ${stage || "unknown"}`).join("; ");
    $.export("$summary", `Retrieved status for request ${this.requestNumber}${state
      ? `: ${state}`
      : ""}${itemStatus
      ? ` (${itemStatus})`
      : ""}`);

    return [
      {
        ...request,
        requested_items: requestedItems,
      },
    ];
  },
};
