import app from "../../mumble.app.mjs";

export default {
  key: "mumble-add-new-customer",
  name: "Add New Customer",
  description: "Adds a new customer. [See the documentation](https://app.mumble.co.il/mumbleapi/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerPhone: {
      propDefinition: [
        app,
        "customerPhone",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
    utmSource: {
      propDefinition: [
        app,
        "utmSource",
      ],
    },
    utmMedium: {
      propDefinition: [
        app,
        "utmMedium",
      ],
    },
    utmCampaign: {
      propDefinition: [
        app,
        "utmCampaign",
      ],
    },
    gclid: {
      propDefinition: [
        app,
        "gclid",
      ],
    },
    currentUrl: {
      propDefinition: [
        app,
        "currentUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addNewCustomer({
      $,
      data: {
        customer_phone: this.customerPhone,
        name: this.name,
        email: this.email,
        source: this.source,
        utm_source: this.utmSource,
        utm_medium: this.utmMedium,
        utm_campaign: this.utmCampaign,
        gclid: this.gclid,
        current_url: this.currentUrl,
      },
    });
    $.export("$summary", "Successfully sent the request to add a new customer: " + response.message);
    return response;
  },
};
