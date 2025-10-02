import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-delete-tracking-category",
  name: "Delete tracking category",
  description: "Delete a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#delete-trackingcategories).",
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
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.deleteTrackingCategory({
        $,
        tenantId: this.tenantId,
        trackingCategoryId: this.trackingCategoryId,
      });

      $.export("$summary", `Successfully deleted tracking category with ID: ${this.trackingCategoryId}`);
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(data.Elements?.[0]?.ValidationErrors?.[0]?.Message || data);
    }
  },
};
