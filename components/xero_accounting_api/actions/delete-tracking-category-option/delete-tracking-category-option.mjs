import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-delete-tracking-category-option",
  name: "Delete tracking category option",
  description: "Delete a tracking category option by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#delete-trackingcategories).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.deleteTrackingOption({
        $,
        tenantId: this.tenantId,
        trackingCategoryId: this.trackingCategoryId,
        trackingOptionId: this.trackingOptionId,
      });

      $.export("$summary", `Successfully deleted tracking category option with ID: ${this.trackingOptionId}`);
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(data.Elements[0].ValidationErrors[0].Message);
    }
  },
};
