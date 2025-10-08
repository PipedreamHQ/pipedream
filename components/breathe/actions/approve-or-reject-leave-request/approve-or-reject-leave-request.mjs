import breathe from "../../breathe.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "breathe-approve-or-reject-leave-request",
  name: "Approve or Reject Leave Request",
  description: "Approve or reject an employee leave request in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/leave_requests)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    breathe,
    employeeId: {
      propDefinition: [
        breathe,
        "employeeId",
      ],
    },
    leaveRequestId: {
      propDefinition: [
        breathe,
        "leaveRequestId",
        (c) => ({
          employeeId: c.employeeId,
        }),
      ],
    },
    approveOrReject: {
      type: "string",
      label: "Approve or Reject?",
      description: "Whether to approve or reject the leave request",
      options: [
        "approve",
        "reject",
      ],
    },
    rejectionReason: {
      type: "string",
      label: "Rejection Reason",
      description: "The reason for rejecting the leave request",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.approveOrReject === "reject" && !this.rejectionReason) {
      throw new ConfigurationError("Rejection Reason is required if rejecting the leave request");
    }

    let response;
    if (this.approveOrReject === "reject") {
      response = await this.breathe.rejectLeaveRequest({
        $,
        leaveRequestId: this.leaveRequestId,
        data: {
          leave_request: {
            rejection_reason: this.rejectionReason,
          },
        },
      });
    }
    else {
      response = await this.breathe.approveLeaveRequest({
        $,
        leaveRequestId: this.leaveRequestId,
      });
    }

    $.export("$summary", `Successfully ${this.approveOrReject === "reject"
      ? "rejected"
      : "approved"} leave request with ID: ${this.leaveRequestId}`);
    return response;
  },
};
