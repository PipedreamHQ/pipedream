import dynamics from "../../dynamics_365_business_central_api.app.mjs";

export default {
  key: "dynamics_365_business_central_api-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/api-reference/v2.0/api/dynamics_customer_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dynamics,
    companyId: {
      propDefinition: [
        dynamics,
        "companyId",
      ],
    },
    name: {
      propDefinition: [
        dynamics,
        "name",
      ],
    },
    email: {
      propDefinition: [
        dynamics,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        dynamics,
        "phone",
      ],
    },
    address: {
      propDefinition: [
        dynamics,
        "address",
      ],
    },
    city: {
      propDefinition: [
        dynamics,
        "city",
      ],
    },
    state: {
      propDefinition: [
        dynamics,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        dynamics,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        dynamics,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dynamics.createCustomer({
      $,
      companyId: this.companyId,
      data: {
        displayName: this.name,
        phoneNumber: this.phone,
        email: this.email,
        address: {
          street: this.address,
          city: this.city,
          state: this.state,
          countryLetterCode: this.coutry,
          postalCode: this.postalCode,
        },
      },
    });
    $.export("$summary", `Successfully created customer with ID ${response.id}`);
    return response;
  },
};
