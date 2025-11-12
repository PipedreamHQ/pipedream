import app from "../../americommerce.app.mjs";

export default {
  key: "americommerce-update-customer",
  name: "Update Customer",
  description: "Updates the details of a registered customer. [See the documentation](https://developers.cart.com/docs/rest-api/5da2f1ddbe199-update-a-customer).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    customerNumber: {
      type: "string",
      label: "Customer Number",
      description: "The customer number for the customer.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the customer.",
      optional: true,
    },
    adcodeId: {
      propDefinition: [
        app,
        "adcodeId",
      ],
    },
    customerTypeId: {
      propDefinition: [
        app,
        "customerTypeId",
      ],
    },
    isNoTaxCustomer: {
      type: "boolean",
      label: "Is No Tax Customer",
      description: "Whether the customer is a no-tax customer.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments about the customer.",
      optional: true,
    },
    storeId: {
      propDefinition: [
        app,
        "storeId",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the customer.",
      optional: true,
    },
    searchString: {
      type: "string",
      label: "Search String",
      description: "The search string for the customer.",
      optional: true,
    },
    noAccount: {
      type: "boolean",
      label: "No Account",
      description: "Indicates whether the customer does not have an account.",
      optional: true,
    },
    alternatePhoneNumber: {
      type: "string",
      label: "Alternate Phone Number",
      description: "The alternate phone number for the customer.",
      optional: true,
    },
    isAffiliateCustomer: {
      type: "boolean",
      label: "Is Affiliate Customer",
      description: "Whether the customer is an affiliate customer.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username for the customer.",
      optional: true,
    },
    isContactInformationOnly: {
      type: "boolean",
      label: "Is Contact Information Only",
      description: "Whether the customer is contact information only.",
      optional: true,
    },
    taxExemptionNumber: {
      type: "string",
      label: "Tax Exemption Number",
      description: "The tax exemption number for the customer.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company for the customer.",
      optional: true,
    },
    taxRate: {
      type: "string",
      label: "Tax Rate",
      description: "The tax rate for the customer.",
      optional: true,
    },
    lockDefaultAddress: {
      type: "boolean",
      label: "Lock Default Address",
      description: "Whether the default address is locked.",
      optional: true,
    },
    paymentNetTerm: {
      type: "integer",
      label: "Payment Net Term",
      description: "The payment net term for the customer.",
      optional: true,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "The credit limit for the customer.",
      optional: true,
    },
    isInactive: {
      type: "boolean",
      label: "Is Inactive",
      description: "Whether the customer is inactive.",
      optional: true,
    },
    useSharedCreditLimit: {
      type: "boolean",
      label: "Use Shared Credit Limit",
      description: "Whether the shared credit limit is used.",
      optional: true,
    },
    overrideSharedCreditLimit: {
      type: "boolean",
      label: "Override Shared Credit Limit",
      description: "Whether the shared credit limit is overridden.",
      optional: true,
    },
  },
  methods: {
    updateCustomer({
      customerId, ...args
    } = {}) {
      return this.app.put({
        path: `/customers/${customerId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateCustomer,
      customerId,
      customerNumber,
      lastName,
      firstName,
      email,
      phoneNumber,
      adcodeId,
      customerTypeId,
      isNoTaxCustomer,
      comments,
      storeId,
      source,
      searchString,
      noAccount,
      alternatePhoneNumber,
      isAffiliateCustomer,
      username,
      isContactInformationOnly,
      taxExemptionNumber,
      company,
      taxRate,
      lockDefaultAddress,
      paymentNetTerm,
      creditLimit,
      isInactive,
      useSharedCreditLimit,
      overrideSharedCreditLimit,
    } = this;

    const response = await updateCustomer({
      $,
      customerId,
      data: {
        customer_number: customerNumber,
        last_name: lastName,
        first_name: firstName,
        email,
        phone_number: phoneNumber,
        adcode_id: adcodeId,
        customer_type_id: customerTypeId,
        is_no_tax_customer: isNoTaxCustomer,
        comments,
        store_id: storeId,
        source,
        search_string: searchString,
        no_account: noAccount,
        alternate_phone_number: alternatePhoneNumber,
        is_affiliate_customer: isAffiliateCustomer,
        username,
        is_contact_information_only: isContactInformationOnly,
        tax_exemption_number: taxExemptionNumber,
        company,
        tax_rate: taxRate,
        lock_default_address: lockDefaultAddress,
        payment_net_term: paymentNetTerm,
        credit_limit: creditLimit,
        is_inactive: isInactive,
        use_shared_credit_limit: useSharedCreditLimit,
        override_shared_credit_limit: overrideSharedCreditLimit,
      },
    });

    $.export("$summary", `Successfully updated customer with ID \`${response.id}\`.`);
    return response;
  },
};
