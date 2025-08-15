import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-update-tracking-category-option",
  name: "Update tracking category option",
  description: "Update a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#post-trackingcategories).",
  version: "0.0.1",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    trackingCategoryId: {
      propDefinition: [
        xeroAccountingApi,
        "trackingCategoryId",
        ({ tenantId }) => ({
          tenantId,
        }),
      ],
    },
    trackingOptionId: {
      propDefinition: [
        xeroAccountingApi,
        "trackingOptionId",
        ({
          tenantId, trackingCategoryId,
        }) => ({
          tenantId,
          trackingCategoryId,
        }),
      ],
    },
    optionName: {
      type: "string",
      label: "Option name",
      description: "The name of the tracking category option",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the tracking category option",
      options: [
        "ACTIVE",
        "ARCHIVED",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.updateTrackingOption({
        $,
        tenantId: this.tenantId,
        trackingCategoryId: this.trackingCategoryId,
        trackingOptionId: this.trackingOptionId,
        data: {
          Name: this.optionName,
          Status: this.status,
        },
      });

      $.export("$summary", `Successfully updated tracking category option with ID: ${this.trackingOptionId}`);
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(data.Elements[0].ValidationErrors[0].Message);
    }
  },
};
