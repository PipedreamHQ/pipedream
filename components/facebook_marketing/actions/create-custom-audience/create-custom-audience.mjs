import app from "../../facebook_marketing.app.mjs";

export default {
  key: "facebook_marketing-create-custom-audience",
  name: "Create Custom Audience",
  description: "Creates a new custom audience in Facebook. [See the documentation](https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences/#build)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    adAccountId: {
      propDefinition: [
        app,
        "adAccountId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    customerFileSource: {
      propDefinition: [
        app,
        "customerFileSource",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomAudience({
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
