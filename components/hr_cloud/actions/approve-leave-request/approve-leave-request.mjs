import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-approve-leave-request",
  name: "Approve Leave Request",
  description: "Approve a pending employee leave request. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
  version: "0.0.1",
  type: "action",
  props: {
    hrCloud,
    leaveRequestId: {
      propDefinition: [
        hrCloud,
        "leaveRequestId",
      ],
    },
    approvalNote: {
      propDefinition: [
        hrCloud,
        "approvalNote",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hrCloud.approveLeaveRequest(this.leaveRequestId, {
      $,
      data: {
        note: this.approvalNote,
      },
    });

    $.export("$summary", `Successfully approved leave request (ID: ${this.leaveRequestId})`);
    return response;
  },
};
