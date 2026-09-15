import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-deny-time-off-request",
  name: "Deny Time Off Request",
  description: "Deny a time off request (POST /time-off/requests/{id}/denials). A single denial is final — it discards any remaining approval steps, so the request always ends in `DENIED` status. Fails with 409 if the request is not currently `REQUESTED`. Use **List Time Off Requests** to find the request ID. [See the documentation](https://documentation.bamboohr.com/reference/create-time-off-request-denial)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
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
      description: "Changes who may deny the request, not what denying does.",
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
    const response = await this.bamboohr.denyTimeOffRequest({
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
    $.export("$summary", `Denied time off request ${this.requestId}`);
    return response;
  },
};
