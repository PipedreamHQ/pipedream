import rejoiner from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-update-customer-profile",
  name: "Update Customer Profile",
  description: "Updates a customer's profile information. [See the documentation](https://docs.rejoiner.com/reference/update-customer-profile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rejoiner,
    email: {
      propDefinition: [
        rejoiner,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        rejoiner,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        rejoiner,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        rejoiner,
        "phone",
      ],
    },
    timezone: {
      propDefinition: [
        rejoiner,
        "timezone",
      ],
    },
    language: {
      propDefinition: [
        rejoiner,
        "language",
      ],
    },
    address1: {
      propDefinition: [
        rejoiner,
        "address1",
      ],
    },
    address2: {
      propDefinition: [
        rejoiner,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        rejoiner,
        "city",
      ],
    },
    state: {
      propDefinition: [
        rejoiner,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        rejoiner,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        rejoiner,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rejoiner.updateCustomerProfile({
      $,
      params: {
        email: this.email,
      },
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        timezone: this.timezone,
        language: this.language,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
      },
    });
    $.export("$summary", `Updated customer profile for customer ${this.email}`);
    return response;
  },
};
