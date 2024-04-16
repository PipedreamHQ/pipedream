import recharge from "../../recharge.app.mjs";

export function getCustomerProps(optional = false) {
  return {
    email: {
      propDefinition: [
        recharge,
        "email",
      ],
      optional,
    },
    firstName: {
      propDefinition: [
        recharge,
        "firstName",
      ],
      optional,
    },
    lastName: {
      propDefinition: [
        recharge,
        "lastName",
      ],
      optional,
    },
    phone: {
      propDefinition: [
        recharge,
        "phone",
      ],
      optional: true,
    },
    externalCustomerId: {
      propDefinition: [
        recharge,
        "externalCustomerId",
      ],
      optional: true,
    },
    taxExempt: {
      propDefinition: [
        recharge,
        "taxExempt",
      ],
      optional: true,
    },
  };
}

export function getCustomerData() {
  return {
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
}
