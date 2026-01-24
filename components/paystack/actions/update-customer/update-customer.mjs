import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-update-customer",
  name: "Update Customer",
  description: "Update a customer's details on your integration. [See the documentation](https://paystack.com/docs/api/customer/#update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    paystack,
    customerCode: {
      propDefinition: [
        paystack,
        "customerCode",
      ],
    },
    firstName: {
      propDefinition: [
        paystack,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        paystack,
        "lastName",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        paystack,
        "phone",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        paystack,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paystack.updateCustomer({
      $,
      code: this.customerCode,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        metadata: this.metadata,
      },
    });

    $.export("$summary", `Successfully updated customer ${this.customerCode}`);
    return response;
  },
};
