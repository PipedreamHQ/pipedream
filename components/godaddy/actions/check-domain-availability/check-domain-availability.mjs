import godaddy from "../../godaddy.app.mjs";

export default {
  key: "godaddy-check-domain-availability",
  name: "Check Domain Availability",
  description: "Check the availability of a domain. [See the documentation](https://developer.godaddy.com/doc/endpoint/domains#/v1/available)",
  version: "0.0.1",
  type: "action",
  props: {
    godaddy,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to check availability for",
    },
    checkType: {
      type: "string",
      label: "Check Type",
      description: "Optimize for time ('FAST') or accuracy ('FULL')",
      options: [
        "FAST",
        "FULL",
      ],
      optional: true,
    },
    forTransfer: {
      type: "boolean",
      label: "For Transfer",
      description: "Whether or not to include domains available for transfer. If set to `true`, checkType is ignored",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.godaddy.checkDomainAvailability({
      $,
      params: {
        domain: this.domain,
        checkType: this.checkType,
        forTransfer: this.forTransfer,
      },
    });
    $.export("$summary", `Successfully checked domain availability for ${this.domain}`);
    return response;
  },
};
