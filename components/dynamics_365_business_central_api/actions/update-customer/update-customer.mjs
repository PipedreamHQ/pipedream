import dynamics from "../../dynamics_365_business_central_api.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dynamics_365_business_central_api-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer. [See the documentation](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/api-reference/v2.0/api/dynamics_customer_update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    customerId: {
      propDefinition: [
        dynamics,
        "customerId",
        (c) => ({
          companyId: c.companyId,
        }),
      ],
    },
    name: {
      propDefinition: [
        dynamics,
        "name",
      ],
      optional: true,
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
  methods: {
    async buildAddress($) {
      const { address } = await this.dynamics.getCustomer({
        companyId: this.companyId,
        customerId: this.customerId,
        $,
      });
      return {
        street: this.address || address.street,
        city: this.city || address.city,
        state: this.state || address.state,
        countryLetterCode: this.country || address.countryLetterCode,
        postalCode: this.postalCode || address.postalCode,
      };
    },
  },
  async run({ $ }) {
    const hasAddress = this.address
      || this.city
      || this.state
      || this.countryLetterCode
      || this.postalCode;
    const response = await this.dynamics.updateCustomer({
      $,
      companyId: this.companyId,
      customerId: this.customerId,
      data: utils.cleanObject({
        displayName: this.name,
        phoneNumber: this.phone,
        email: this.email,
        address: hasAddress
          ? await this.buildAddress($)
          : undefined,
      }),
    });
    $.export("$summary", `Successfully updated customer with ID ${this.customerId}`);
    return response;
  },
};
