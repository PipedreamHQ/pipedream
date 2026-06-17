import servicenow from "../../servicenow.app.mjs";
import constants from "../../common/constants.mjs";

const { APPROVAL_STATE } = constants;

export default {
  key: "servicenow-decline-cart",
  name: "Decline Cart",
  description: "Decline a pending ServiceNow catalog request approval by setting the approver record state to rejected. Operates on a `sysapproval_approver` record `sys_id`. This rejection changes the approval workflow outcome. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    approvalSysId: {
      type: "string",
      label: "Approval Sys ID",
      description: "The `sys_id` of the `sysapproval_approver` record to reject. Use **Get Table Records** on `sysapproval_approver` to find pending approvals.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.updateApproval({
      $,
      approvalSysId: this.approvalSysId,
      data: {
        state: APPROVAL_STATE.REJECTED,
      },
    });

    $.export("$summary", `Successfully declined approval record ${this.approvalSysId}`);

    return response;
  },
};
