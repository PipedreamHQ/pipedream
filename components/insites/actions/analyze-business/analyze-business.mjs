import app from "../../insites.app.mjs";

export default {
  key: "insites-analyze-business",
  name: "Analyze Business",
  description: "Fetch a report from Insites based on the provided business details. [See the documentation](https://help.insites.com/en/articles/7994946-report-api#h_83076c4431)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The website URL to fetch the report for.",
    },
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The name of the business.",
      optional: true,
    },
    businessPhone: {
      type: "string",
      label: "Business Phone",
      description: "The phone number of the business.",
      optional: true,
    },
    businessAddress: {
      type: "string",
      label: "Business Address",
      description: "The address of the business.",
      optional: true,
    },
    businessCity: {
      type: "string",
      label: "Business City",
      description: "The city where the business is located.",
      optional: true,
    },
    businessZipCode: {
      type: "string",
      label: "Business Zip Code",
      description: "The zip code of the business location.",
      optional: true,
    },
    businessCountryCode: {
      type: "string",
      label: "Business Country Code",
      description: "The [country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the business location.",
      optional: true,
    },
  },
  async run({ $ }) {
    const reportData = await this.app.analyzeBusiness({
      url: this.url,
      name: this.businessName,
      phone: this.businessPhone,
      address: this.businessAddress,
      city: this.businessCity,
      zip: this.businessZipCode,
      country_code: this.businessCountryCode,
    });
    $.export("$summary", `Successfully fetched report for URL: ${this.url}.`);

    return reportData;
  },
};
