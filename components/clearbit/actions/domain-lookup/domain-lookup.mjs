import app from "../../clearbit.app.mjs";

export default {
  key: "clearbit-domain-lookup",
  name: "Domain lookup",
  description: "The Company API allows you to look up a company by their domain. [See the docs here](https://dashboard.clearbit.com/docs?javascript#enrichment-api-company-api-domain-lookup).",
  version: "0.1.2",
  type: "action",
  props: {
    app,
    domain: {
      label: "Domain",
      type: "string",
      description: "The domain to look up.",
    },
    webhookUrl: {
      label: "Webhook URL",
      type: "string",
      description: "A webhook URL that results will be sent to.",
      optional: true,
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
      optional: true,
    },
    linkedin: {
      label: "LinkedIn",
      type: "string",
      description: "The LinkedIn URL for the company.",
      optional: true,
    },
    twitter: {
      label: "Twitter",
      type: "string",
      description: "The Twitter handle for the company.",
      optional: true,
    },
    facebook: {
      label: "Facebook",
      type: "string",
      description: "The Facebook URL for the company.",
      optional: true,
    },
  },
  async run({ $ }) {
    const res = await this.app.domainLookup($, {
      domain: this.domain,
      webhook_url: this.webhookUrl,
      company_name: this.companyName,
      linkedin: this.linkedin,
      twitter: this.twitter,
      facebook: this.facebook,
    });
    if (res.error?.message) {
      $.export("$summary", res.error.message);
      throw new Error(res.error?.message);
    }
    $.export("$summary", "Successfully looked up domain.");
    return res;
  },
};
