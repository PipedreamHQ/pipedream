import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-create-organization",
  name: "Create Organization",
  description: "Creates a new organization within your DNSFilter account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dnsfilter,
    organizationName: dnsfilter.propDefinitions.organizationName,
    location: {
      ...dnsfilter.propDefinitions.location,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dnsfilter.createOrganization({
      organizationName: this.organizationName,
      location: this.location,
    });
    $.export("$summary", `Successfully created organization: ${this.organizationName}`);
    return response;
  },
};
