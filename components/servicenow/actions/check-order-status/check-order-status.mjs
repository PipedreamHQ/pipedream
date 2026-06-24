import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-check-order-status",
  name: "Check Order Status",
  description: "Retrieve the status of a ServiceNow catalog request (REQ) from the `sc_request` table, including request state, approval, and stage. Provide the request number returned by **Checkout Cart**, **Custom Checkout Cart**, or **Order Catalog Item**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const response = await this.servicenow.getRequests({
      $,
      params: {
        sysparm_query: `number=${this.requestNumber}`,
        sysparm_limit: 1,
      },
    });

    const request = response[0];
    const state = request?.state ?? request?.request_state;
    const summary = state
      ? `Retrieved status for request ${this.requestNumber}: ${state}`
      : `Retrieved status for request ${this.requestNumber}`;
    $.export("$summary", summary);

    return response;
  },
};
