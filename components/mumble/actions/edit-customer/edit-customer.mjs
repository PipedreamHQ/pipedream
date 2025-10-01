import app from "../../mumble.app.mjs";

export default {
  key: "mumble-edit-customer",
  name: "Edit Customer",
  description: "Edits the customer with the specified phone number. [See the documentation](https://app.mumble.co.il/mumbleapi/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    const response = await this.app.editCustomer({
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
    $.export("$summary", "Successfully sent the request to edit a customer: " + response.message);
    return response;
  },
};
