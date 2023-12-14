import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-assign-policy-site",
  name: "Assign Policy to Site",
  description: "Assigns a pre-existing policy to a specific site within your dnsfilter account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dnsfilter,
    siteName: {
      type: "string",
      label: "Site Name",
      description: "The name of the site to which a policy should be assigned",
    },
    policyName: {
      type: "string",
      label: "Policy Name",
      description: "The name of the policy to be assigned to a site",
    },
  },
  async run({ $ }) {
    const response = await this.dnsfilter.assignPolicyToSite({
      siteName: this.siteName,
      policyName: this.policyName,
    });
    $.export("$summary", `Successfully assigned policy '${this.policyName}' to site '${this.siteName}'`);
    return response;
  },
};
