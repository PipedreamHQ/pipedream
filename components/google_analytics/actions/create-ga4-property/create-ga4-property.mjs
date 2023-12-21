import googleAnalytics from "../../google_analytics.app.mjs";
import { INDUSTRY_CATEGORY_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "google_analytics-create-ga4-property",
  name: "Create GA4 Property",
  description: "Creates a new GA4 property. [See the documentation](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties/create)",
  version: "0.0.1",
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
      description: "The reporting time zone for the property. Example: `America/Los_Angeles`",
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The currency type to be used in reports involving monetary values, [in ISO 4217 format](https://en.wikipedia.org/wiki/ISO_4217). Examples: `USD`, `EUR`, `JPY`",
      optional: true,
    },
    industryCategory: {
      type: "string",
      label: "Industry Category",
      description: "The industry category associated with the property.",
      optional: true,
      options: INDUSTRY_CATEGORY_OPTIONS,
    },
  },
  async run({ $ }) {
    const accountId = this.account.split("/").pop(); // Extracting the account ID
    const propertyBody = {
      displayName: this.displayName,
      timeZone: this.timeZone,
      currencyCode: this.currencyCode,
      industryCategory: this.industryCategory,
    };

    const response = await this.googleAnalytics.createProperty(accountId, propertyBody);

    $.export("$summary", `Successfully created GA4 property with display name "${this.displayName}"`);
    return response;
  },
};
