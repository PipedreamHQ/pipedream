import kenjo from "../../kenjo.app.mjs";

export default {
  key: "kenjo-update-leave-request",
  name: "Update Leave Request",
  description: "Updates an existing leave request in Kenjo. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kenjo,
    updateLeaveRequestId: {
      propDefinition: [
        kenjo,
        "updateLeaveRequestId",
      ],
    },
    updateLeaveStatus: {
      propDefinition: [
        kenjo,
        "updateLeaveStatus",
      ],
    },
    updateLeaveStartDate: {
      propDefinition: [
        kenjo,
        "updateLeaveStartDate",
      ],
    },
    updateLeaveEndDate: {
      propDefinition: [
        kenjo,
        "updateLeaveEndDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kenjo.updateLeaveRequest({
      leaveRequestId: this.updateLeaveRequestId,
      status: this.updateLeaveStatus,
      startDate: this.updateLeaveStartDate,
      endDate: this.updateLeaveEndDate,
    });
    $.export("$summary", `Updated leave request with ID ${this.updateLeaveRequestId}`);
    return response;
  },
};
