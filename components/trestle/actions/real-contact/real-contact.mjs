import app from "../../trestle.app.mjs";

export default {
  key: "trestle-real-contact",
  name: "Real Contact",
  description: "Verifies and grades phone numbers, emails, and addresses. [See the documentation](https://trestle-api.redoc.ly/Current/tag/Real-Contact-API#operation/realContact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phone: {
      propDefinition: [
        app,
        "phone",
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
    ipAddress: {
      propDefinition: [
        app,
        "ipAddress",
      ],
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    stateCode: {
      propDefinition: [
        app,
        "stateCode",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.realContact({
      $,
      params: {
        phone: this.phone,
        name: this.name,
        email: this.email,
        ip_address: this.ipAddress,
        address: {
          street_line_1: this.street,
          city: this.city,
          state_code: this.stateCode,
          postal_code: this.postalCode,
          country_code: this.countryCode,
        },
      },
    });
    $.export("$summary", "Successfully executed contact lookup");
    return response;
  },
};
