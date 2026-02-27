import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-company-lookup",
  name: "Get Company Lookup",
  description: "Resolve a company profile from company name, domain name, and/or location. Cost: 2 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    companyName: {
      propDefinition: [
        enrichlayer,
        "companyName",
      ],
      description: "The company name. Requires either Company Name or Company Domain.",
      optional: true,
    },
    companyDomain: {
      propDefinition: [
        enrichlayer,
        "companyDomain",
      ],
      description: "The company website or domain (e.g., `accenture.com`). Requires either Company Name or Company Domain.",
      optional: true,
    },
    companyLocation: {
      type: "string",
      label: "Company Location",
      description: "The location/region of the company. ISO 3166-1 Alpha-2 code (e.g., `sg`).",
      optional: true,
    },
    enrichProfile: {
      propDefinition: [
        enrichlayer,
        "enrichProfile",
      ],
    },
  },
  async run({ $ }) {
    if (!this.companyName && !this.companyDomain) {
      throw new Error("At least one of Company Name or Company Domain must be provided.");
    }
    const response = await this.enrichlayer.getCompanyLookup({
      $,
      params: {
        company_name: this.companyName,
        company_domain: this.companyDomain,
        company_location: this.companyLocation,
        enrich_profile: this.enrichProfile,
      },
    });
    $.export("$summary", `Successfully resolved company: ${this.companyName || this.companyDomain}`);
    return response;
  },
};
