import facebookMarketingApi from "../../facebook_marketing.app.mjs";

export default {
  key: "facebook_marketing-create-custom-audience",
  name: "Create Custom Audience",
  description: "Creates a new custom audience in Facebook. [See the documentation](https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    facebookMarketingApi,
    adAccountId: {
      propDefinition: [
        facebookMarketingApi,
        "adAccountId",
      ],
    },
    name: {
      propDefinition: [
        facebookMarketingApi,
        "name",
      ],
    },
    description: {
      propDefinition: [
        facebookMarketingApi,
        "description",
      ],
    },
    customerFileSource: {
      propDefinition: [
        facebookMarketingApi,
        "customerFileSource",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.facebookMarketingApi.createCustomAudience({
      $,
      adAccountId: this.adAccountId,
      data: {
        name: this.name,
        description: this.description,
        customer_file_source: this.customerFileSource,
        subtype: "CUSTOM",
      },
    });
    $.export("$summary", `Successfully created custom audience ${this.name}`);
    return response;
  },
};
