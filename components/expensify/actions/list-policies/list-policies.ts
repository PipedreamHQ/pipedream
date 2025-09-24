import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";

export default defineAction({
  key: "expensify-list-policies",
  name: "List Policies",
  description: "Retrieves a list of policies. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#policy-list-getter)",
  version: "0.0.1",
  type: "action",
  props: {
    expensify,
    adminOnly: {
      type: "boolean",
      label: "Admin Only",
      description: "Whether or not to only get policies for which the user is an admin",
      optional: true,
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "Specifies the user to gather the policy list for. You must have been granted third-party access by that user/company domain beforehand.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.expensify.getPolicyList({
      $,
      userEmail: this.userEmail,
      adminOnly: this.adminOnly,
    });

    $.export("$summary", `Successfully retrieved ${response?.policyList?.length || 0} policies`);

    return response?.policyList || [];
  },
})
