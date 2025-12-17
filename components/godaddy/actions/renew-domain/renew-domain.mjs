import godaddy from "../../godaddy.app.mjs";

export default {
  key: "godaddy-renew-domain",
  name: "Renew Domain",
  description: "Renew a domain in GoDaddy. [See the documentation](https://developer.godaddy.com/doc/endpoint/domains#/v1/renew)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    godaddy,
    domain: {
      propDefinition: [
        godaddy,
        "domain",
      ],
    },
    period: {
      type: "integer",
      label: "Period",
      description: "Number of years to extend the Domain. Must not exceed maximum for TLD. When omitted, defaults to period specified during original purchase.",
      max: 10,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.godaddy.renewDomain({
      $,
      domain: this.domain,
      data: {
        period: this.period,
      },
    });
    $.export("$summary", `Renewed domain ${this.domain}`);
    return response;
  },
};
