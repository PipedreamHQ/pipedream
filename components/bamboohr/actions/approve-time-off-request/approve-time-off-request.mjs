import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-approve-time-off-request",
  name: "Approve Time Off Request",
  description: "Approve a time off request, completing the caller's step in the approval chain — or every remaining step when Bypass is true (POST /time-off/requests/{id}/approvals). Fails with 409 if the request is not currently `REQUESTED`. Use **List Time Off Requests** to find the request ID. [See the documentation](https://documentation.bamboohr.com/reference/create-time-off-request-approval)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    managerNote: {
      type: "string",
      label: "Manager Note",
      description: "Optional note recorded on the request by the approver (max 1024 characters).",
      optional: true,
    },
    bypass: {
      type: "boolean",
      label: "Bypass",
      description: "When true, completes every remaining approval step instead of only the caller's.",
      optional: true,
    },
    returnActions: {
      type: "boolean",
      label: "Return Actions",
      description: "When true, the response includes the state transitions available to the caller for this request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.approveTimeOffRequest({
      $,
      requestId: this.requestId,
      params: {
        returnActions: this.returnActions,
      },
      data: {
        managerNote: this.managerNote,
        bypass: this.bypass,
      },
    });
    $.export("$summary", `Approved time off request ${this.requestId}`);
    return response;
  },
};
