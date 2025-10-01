import googleAnalytics from "../../google_analytics.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_analytics-create-ga4-property",
  name: "Create GA4 Property",
  description: "Creates a new GA4 property. [See the documentation](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties/create)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleAnalytics,
    account: {
      propDefinition: [
        googleAnalytics,
        "account",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units.",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The reporting time zone for the property. Must be a valid value from [the IANA timezone database](https://www.iana.org/time-zones).",
      options: constants.TIMEZONE_OPTIONS,
    },
    industryCategory: {
      type: "string",
      label: "Industry Category",
      description: "The industry category associated with the property.",
      optional: true,
      options: constants.INDUSTRY_CATEGORY_OPTIONS,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The currency type to be used in reports involving monetary values, [in ISO 4217 format](https://en.wikipedia.org/wiki/ISO_4217). Examples: `USD`, `EUR`, `JPY`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleAnalytics.createProperty({
      $,
      data: {
        parent: this.account,
        displayName: this.displayName,
        timeZone: this.timeZone,
        currencyCode: this.currencyCode,
        industryCategory: this.industryCategory,
        propertyType: "PROPERTY_TYPE_ORDINARY",
      },
    });

    $.export("$summary", `Successfully created GA4 property with display name "${this.displayName}"`);
    return response;
  },
};
