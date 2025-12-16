import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-update-tracking-category",
  name: "Update tracking category",
  description: "Update a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#post-trackingcategories).",
  version: "0.0.3",
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the tracking category",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the tracking category",
      options: [
        "ACTIVE",
        "ARCHIVED",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.updateTrackingCategory({
        $,
        tenantId: this.tenantId,
        trackingCategoryId: this.trackingCategoryId,
        data: {
          Name: this.name,
          Status: this.status,
        },
      });

      $.export("$summary", `Successfully updated tracking category with ID: ${this.trackingCategoryId}`);
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(data.Elements[0].ValidationErrors[0].Message);
    }
  },
};
