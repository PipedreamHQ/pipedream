import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer's details. [See the documentation](https://developer.rechargepayments.com/2021-11/customers/customers_update)",
  version: "0.0.1",
  type: "action",
  props: {
    recharge,
    customerId: {
      propDefinition: [
        recharge,
        "customerId",
      ],
    },
    email: {
      propDefinition: [
        recharge,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        recharge,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        recharge,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        recharge,
        "phone",
      ],
    },
    externalCustomerId: {
      propDefinition: [
        recharge,
        "externalCustomerId",
      ],
    },
    applyCreditToNextRecurringCharge: {
      propDefinition: [
        recharge,
        "applyCreditToNextRecurringCharge",
      ],
    },
    taxExempt: {
      propDefinition: [
        recharge,
        "taxExempt",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      external_customer_id: this.externalCustomerId && {
        ecommerce: this.externalCustomerId,
      },
      apply_credit_to_next_recurring_charge: this.applyCreditToNextRecurringCharge,
      tax_exempt: this.taxExempt,
    };

    const response = await this.recharge.updateCustomer({
      $,
      customerId: this.customerId,
      data,
    });

    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};
