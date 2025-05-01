import kiwihr from "../../kiwihr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-approve-leave-request",
  name: "Approve Leave Request",
  description: "Approve a pending leave request for an employee. [See the documentation](https://api.kiwihr.it/api/docs/mutation.doc.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kiwihr,
    leaveRequestId: {
      propDefinition: [
        kiwihr,
        "leaveRequestId",
      ],
    },
    approvalDate: {
      propDefinition: [
        kiwihr,
        "approvalDate",
      ],
      optional: true,
    },
    message: {
      propDefinition: [
        kiwihr,
        "message",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kiwihr.approveLeaveRequest({
        leaveRequestId: this.leaveRequestId,
        approvalDate: this.approvalDate,
        message: this.message,
      });

      $.export("$summary", `Successfully approved leave request with ID ${this.leaveRequestId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to approve leave request: ${error.message}`);
    }
  },
};
