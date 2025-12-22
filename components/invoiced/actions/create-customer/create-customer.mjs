import {
  objectCamelToSnakeCase, parseObject,
} from "../../common/utils.mjs";
import invoiced from "../../invoiced.app.mjs";

export default {
  key: "invoiced-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Invoiced. [See the documentation](https://developer.invoiced.com/api/customers#create-a-customer)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    invoiced,
    name: {
      type: "string",
      label: "Name",
      description: "Customer name",
    },
    number: {
      type: "string",
      label: "Number",
      description: "A unique ID to help tie your customer to your external systems. Invoiced will generate one if not supplied",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email address",
      optional: true,
    },
    autoplay: {
      type: "boolean",
      label: "Autoplay",
      description: "AutoPay enabled? Defaults to false",
      optional: true,
    },
    autoplayDelayDays: {
      type: "integer",
      label: "Autoplay Delay Days",
      description: "Number of days to delay AutoPay",
      optional: true,
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      description: "Payment terms when AutoPay is off. (i.e., \"NET 30\")",
      optional: true,
    },
    attentionTo: {
      type: "string",
      label: "Attention To",
      description: "Used for ATTN: address line if `company`",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "Customer address line 1",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Optional second address line",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Customer city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State or province",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Zip or postal code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Customer country [Two-letter ISO code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Customer language [Two-letter ISO code](https://en.wikipedia.org/wiki/ISO_639-1)",
      optional: true,
    },
    curreny: {
      type: "string",
      label: "Currency",
      description: "Customer currency [3-letter ISO code](https://en.wikipedia.org/wiki/ISO_4217)",
      optional: true,
    },
    chase: {
      type: "boolean",
      label: "Chase",
      description: "Chasing enabled? - defaults to true",
      optional: true,
    },
    chasingCadence: {
      propDefinition: [
        invoiced,
        "chasingCadenceId",
      ],
      optional: true,
    },
    nextChaseStep: {
      propDefinition: [
        invoiced,
        "nextChaseStep",
        ({ chasingCadence }) => ({
          chasingCadence,
        }),
      ],
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Customer phone number",
      optional: true,
    },
    creditHold: {
      type: "boolean",
      label: "Credit Hold",
      description: "When true, customer is on credit hold",
      optional: true,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "Customer credit limit",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        invoiced,
        "memberId",
      ],
      optional: true,
    },
    taxable: {
      type: "boolean",
      label: "Taxable",
      description: "Customer taxable?",
      optional: true,
    },
    taxes: {
      propDefinition: [
        invoiced,
        "taxId",
      ],
      type: "string[]",
      label: "Taxes",
      description: "Array of Tax Rate IDs",
      optional: true,
    },
    taxId: {
      propDefinition: [
        invoiced,
        "taxId",
      ],
      optional: true,
    },
    avalaraEntityUseCode: {
      type: "string",
      label: "Avalara Entity Use Code",
      description: "[Avalara-specific entity use code](https://help.avalara.com/Avalara_AvaTax_Update/Exemption_Reason_Matrix_for_US_and_Canada)",
      optional: true,
    },
    avalaraExempltionNumber: {
      type: "string",
      label: "Avalara Exemption Number",
      description: "Tax-exempt number to pass to [Avalara](https://docs.invoiced.com/integrations/avalara)",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Organization type",
      options: [
        {
          label: "Company",
          value: "company",
        },
        {
          label: "Person",
          value: "person",
        },
      ],
      optional: true,
    },
    parentCustomer: {
      propDefinition: [
        invoiced,
        "customerId",
      ],
      label: "Parent Customer ID",
      description: "The parent customer to which this customer belongs",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Private customer notes",
      optional: true,
    },
    signUpPage: {
      type: "string",
      label: "Sign Up Page",
      description: "[Sign up page ID](https://docs.invoiced.com/subscription-billing/sign-up-pages)",
      optional: true,
    },
    metadata: {
      propDefinition: [
        invoiced,
        "metadata",
      ],
    },
    disabledPaymentMethods: {
      propDefinition: [
        invoiced,
        "paymentMethodId",
      ],
    },
    achGateway: {
      type: "integer",
      label: "ACH Gateway",
      description: "Gateway configuration ID to process payments with",
      optional: true,
    },
    ccGateway: {
      type: "integer",
      label: "CC Gateway",
      description: "Gateway configuration ID to process payments with",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      creditLimit,
      taxes,
      disabledPaymentMethods,
      ...data
    } = this;

    if (creditLimit) data.credit_limit = parseFloat(creditLimit);
    if (taxes) data.taxes = parseObject(taxes);
    if (disabledPaymentMethods) data.disabled_payment_methods = parseObject(disabledPaymentMethods);

    const response = await this.invoiced.createCustomer({
      $,
      data: objectCamelToSnakeCase(data),
    });

    $.export("$summary", `Successfully created customer with ID ${response.id}`);

    return response;
  },
};

