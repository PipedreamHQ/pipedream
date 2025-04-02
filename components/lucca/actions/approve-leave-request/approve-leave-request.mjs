import lucca from "../../lucca.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lucca-approve-leave-request",
  name: "Approve Leave Request",
  description: "Approve a pending leave request. [See the documentation](https://developers.lucca.fr/api-reference/legacy/timmi-absences/leave-requests/approve-or-deny-a-leave-request)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lucca,
    leaveRequestId: {
      propDefinition: [
        lucca,
        "leaveRequestId",
      ],
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Whether the leave request should be approved. Defaults to `true`.",
      optional: true,
      default: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Optional comment about the approval decision.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lucca.approveLeaveRequest({
      leaveRequestId: this.leaveRequestId,
      approved: this.approved ?? true,
      comment: this.comment || "",
    });

    $.export("$summary", `Leave request ${this.leaveRequestId} was successfully processed.`);
    return response;
  },
};
