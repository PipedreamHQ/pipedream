import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-check-order-status",
  name: "Check Order Status",
  description: "Retrieve the status of a ServiceNow catalog request (REQ) from the `sc_request` table, including request state, approval, and stage. Provide the request number returned by **Checkout Cart**, **Submit Cart Order**, or **Order Catalog Item**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.2",
  type: "action",
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
    let summary;
    if (!request) {
      summary = `No request found with number ${this.requestNumber}`;
    } else {
      const state = request.state ?? request.request_state;
      summary = state
        ? `Retrieved status for request ${this.requestNumber}: ${state}`
        : `Retrieved status for request ${this.requestNumber}`;
    }
    $.export("$summary", summary);

    return response;
  },
};
