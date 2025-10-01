import app from "../../clearbit.app.mjs";

export default {
  key: "clearbit-domain-lookup",
  name: "Domain lookup",
  description: "The Company API allows you to look up a company by their domain. [See the docs here](https://dashboard.clearbit.com/docs?javascript#enrichment-api-company-api-domain-lookup).",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
      optional: true,
    },
    linkedin: {
      propDefinition: [
        app,
        "linkedin",
      ],
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
    },
    facebook: {
      propDefinition: [
        app,
        "facebook",
      ],
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
      throw new Error(res.error?.message);
    }
    $.export("$summary", "Successfully looked up domain.");
    return res;
  },
};
