import app from "../../finerworks.app.mjs";

export default {
  key: "finerworks-validate-address",
  name: "Validate Address",
  description: "Validate an address. [See the documentation](https://v2.api.finerworks.com/Help/Api/POST-v3-validate_recipient_address)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
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
    province: {
      propDefinition: [
        app,
        "province",
      ],
    },
    zipPostalCode: {
      propDefinition: [
        app,
        "zipPostalCode",
      ],
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.validateAddress({
      $,
      data: {
        recipient: {
          first_name: this.firstName,
          last_name: this.lastName,
          company_name: this.companyName,
          address_1: this.address,
          city: this.city,
          state_code: this.stateCode,
          province: this.province,
          zip_postal_code: this.zipPostalCode,
          country_code: this.countryCode,
          phone: this.phone,
          email: this.email,
        },
      },
    });
    $.export("$summary", "Successfully valid the address: " + response.status.success);
    return response;
  },
};
