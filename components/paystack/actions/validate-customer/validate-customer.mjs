import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-validate-customer",
  name: "Validate Customer",
  description: "Validate a customer's identity. [See the documentation](https://paystack.com/docs/api/customer/#validate)",
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
    },
    lastName: {
      propDefinition: [
        paystack,
        "lastName",
      ],
    },
    type: {
      type: "string",
      label: "Identification Type",
      description: "Predefined types of identification",
      default: "bank_account",
      options: [
        "bank_account",
      ],
    },
    country: {
      propDefinition: [
        paystack,
        "country",
      ],
    },
    bvn: {
      propDefinition: [
        paystack,
        "bvn",
      ],
    },
    bankCode: {
      propDefinition: [
        paystack,
        "bankCode",
      ],
    },
    accountNumber: {
      propDefinition: [
        paystack,
        "accountNumber",
      ],
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "Customer's middle name",
      optional: true,
    },
    value: {
      type: "string",
      label: "Identification Value",
      description: "Customer's identification number",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paystack.validateCustomer({
      $,
      code: this.customerCode,
      data: {
        first_name: this.firstName,
        middle_name: this.middleName,
        last_name: this.lastName,
        type: this.type,
        value: this.value,
        country: this.country,
        bvn: this.bvn,
        bank_code: this.bankCode,
        account_number: this.accountNumber,
      },
    });

    $.export("$summary", `Successfully submitted validation for customer ${this.customerCode}`);
    return response;
  },
};
