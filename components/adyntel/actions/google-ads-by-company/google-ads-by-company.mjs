import adyntel from "../../adyntel.app.mjs";

export default {
  key: "adyntel-google-ads-by-company",
  name: "Get Google Ads by Company",
  description: "Retrieve all Google ads for a given company domain. [See the documentation](https://docs.adyntel.com/ad-libraries/google)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adyntel,
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain. Company domain has to be passed in the 'company.com' format, meaning all prefixes like 'https://' or 'www.' need to be removed.",
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Filter results based on media type",
      options: [
        "text",
        "image",
        "video",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.adyntel.getGoogleAds({
      $,
      data: {
        company_domain: this.companyDomain,
        media_type: this.mediaType,
      },
    });
    $.export("$summary", `Fetched Google Ads for domain ${this.companyDomain}`);
    return response;
  },
};
