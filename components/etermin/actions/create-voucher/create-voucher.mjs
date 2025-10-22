import app from "../../etermin.app.mjs";

export default {
  key: "etermin-create-voucher",
  name: "Create Voucher",
  description: "Create a new voucher on eTermin. [See the documentation](https://app.swaggerhub.com/apis/etermin.net/eTermin-API/1.0.0#/Voucher/post_api_voucher)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    priceInclVat: {
      propDefinition: [
        app,
        "priceInclVat",
      ],
    },
    isPercentage: {
      propDefinition: [
        app,
        "isPercentage",
      ],
    },
    customerEmail: {
      propDefinition: [
        app,
        "customerEmail",
      ],
    },
    validFrom: {
      propDefinition: [
        app,
        "validFrom",
      ],
    },
    validUntil: {
      propDefinition: [
        app,
        "validUntil",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createVoucher({
      $,
      params: {
        id: this.id,
        description: this.description,
        priceinclvat: this.priceInclVat,
        priceoriginal: this.priceInclVat, // Docs: Should be the same value as in priceinclvat, important with contingent
        ispercentage: this.isPercentage
          ? 1
          : 0,
        customeremail: this.customerEmail,
        validfrom: this.validFrom,
        validuntil: this.validUntil,
      },
    });
    $.export("$summary", "Successfully created the new voucher");
    return response;
  },
};
