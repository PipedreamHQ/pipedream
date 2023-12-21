import googleAnalytics from "../../google_analytics.app.mjs";

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
        {
          options: async () => {
            const accounts = await this.listAccounts();
            return accounts.map((account) => ({
              label: account.displayName,
              value: account.name,
            }));
          },
        },
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name for the property.",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The reporting time zone for the property.",
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The currency type to be used in reports involving monetary values.",
    },
    industryCategory: {
      type: "string",
      label: "Industry Category",
      description: "The industry category associated with the property.",
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
