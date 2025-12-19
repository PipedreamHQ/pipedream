import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-tracking-category",
  name: "Create tracking category",
  description: "Create a new tracking category [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#put-trackingcategories).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the tracking category",
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "Options for the tracking category",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.createTrackingCategory({
        $,
        tenantId: this.tenantId,
        data: {
          Name: this.name,
        },
      });

      if (this.options) {
        const parsedOptions = parseObject(this.options);

        for (const option of parsedOptions) {
          const optionResponse = await this.xeroAccountingApi.createTrackingOption({
            $,
            tenantId: this.tenantId,
            trackingCategoryId: response.TrackingCategories[0].TrackingCategoryID,
            data: {
              Name: option,
            },
          });
          response.TrackingCategories[0].Options.push(optionResponse.Options[0]);
        }
      }

      $.export("$summary", `Successfully created tracking category with ID: ${response.TrackingCategories[0].TrackingCategoryID}`);
      return response;
    } catch (err) {
      console.log(err);
      throw new ConfigurationError(err.response.data.Elements[0].ValidationErrors[0].Message);
    }
  },
};
