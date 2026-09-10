import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-cancel-time-off-request",
  name: "Cancel Time Off Request",
  description: "Cancel a time off request (POST /time-off/requests/{id}/cancellations). Available to the requester and anyone with authority to manage it; a request can be canceled while `REQUESTED`, and after approval only if it hasn't started yet. Takes no request body. Use **List Time Off Requests** to find the request ID. [See the documentation](https://documentation.bamboohr.com/reference/create-time-off-request-cancellation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    requestId: {
      propDefinition: [
        bamboohr,
        "requestId",
      ],
    },
    returnActions: {
      type: "boolean",
      label: "Return Actions",
      description: "When true, the response includes the state transitions available to the caller for this request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.cancelTimeOffRequest({
      $,
      requestId: this.requestId,
      params: {
        returnActions: this.returnActions,
      },
    });
    $.export("$summary", `Canceled time off request ${this.requestId}`);
    return response;
  },
};
