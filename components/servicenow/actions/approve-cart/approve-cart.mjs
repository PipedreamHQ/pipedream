import servicenow from "../../servicenow.app.mjs";
import constants from "../../common/constants.mjs";

const { APPROVAL_STATE } = constants;

export default {
  key: "servicenow-approve-cart",
  name: "Approve Cart",
  description: "Approve a pending ServiceNow catalog request approval by setting the approver record state to approved. Operates on a `sysapproval_approver` record `sys_id`. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html)",
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
      propDefinition: [
        servicenow,
        "approvalSysId",
      ],
      description: "The `sys_id` of the `sysapproval_approver` record to approve. Use **Get Table Records** on `sysapproval_approver` to find pending approvals.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.updateApproval({
      $,
      approvalSysId: this.approvalSysId,
      data: {
        state: APPROVAL_STATE.APPROVED,
      },
    });

    $.export("$summary", `Successfully approved approval record ${this.approvalSysId}`);

    return response;
  },
};
