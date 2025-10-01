import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-assign-policy-site",
  name: "Assign Policy to Site",
  description: "Assigns a pre-existing policy to a specific site within your DNSFilter account. [See the documentation](https://app.swaggerhub.com/apis-docs/DNSFilter/dns-filter_api/1.0.15#/Networks/Networks-update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dnsfilter,
    networkId: {
      propDefinition: [
        dnsfilter,
        "networkId",
      ],
    },
    policyId: {
      propDefinition: [
        dnsfilter,
        "policyId",
      ],
    },
  },
  async run({ $ }) {
    const { data: network } = await this.dnsfilter.getNetwork({
      networkId: this.networkId,
      $,
    });

    const response = await this.dnsfilter.assignPolicyToSite({
      networkId: this.networkId,
      data: {
        network: {
          name: network.attributes.name,
          organization_id: network.relationships.organization.data.id,
          policy_ids: [
            this.policyId,
          ],
        },
      },
      $,
    });
    $.export("$summary", `Successfully assigned policy '${this.policyId}' to site '${this.networkId}.'`);
    return response;
  },
};
