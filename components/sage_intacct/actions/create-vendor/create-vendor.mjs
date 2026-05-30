import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-create-vendor",
  name: "Create Vendor",
  description: "Creates a new vendor. When you add a new vendor, you can provide key descriptive information about that vendor and establish how you want to pay them. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/vendors/tags/accounts_payable_vendors/paths/create-accounts-payable-vendor)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: false,
  },
  props: {
    app,
    vendorId: {
      propDefinition: [
        app,
        "vendorId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "vendorName",
      ],
    },
    taxId: {
      propDefinition: [
        app,
        "vendorTaxId",
      ],
    },
    creditLimit: {
      propDefinition: [
        app,
        "vendorCreditLimit",
      ],
    },
    billingType: {
      propDefinition: [
        app,
        "vendorBillingType",
      ],
    },
    paymentPriority: {
      propDefinition: [
        app,
        "vendorPaymentPriority",
      ],
    },
    status: {
      propDefinition: [
        app,
        "vendorStatus",
      ],
    },
    isOnHold: {
      propDefinition: [
        app,
        "vendorIsOnHold",
      ],
    },
    doNotPay: {
      propDefinition: [
        app,
        "vendorDoNotPay",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "vendorNotes",
      ],
    },
    vendorAccountNumber: {
      propDefinition: [
        app,
        "vendorAccountNumber",
      ],
    },
    preferredPaymentMethod: {
      propDefinition: [
        app,
        "vendorPreferredPaymentMethod",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      vendorId,
      name,
      taxId,
      creditLimit,
      billingType,
      paymentPriority,
      status,
      isOnHold,
      doNotPay,
      notes,
      vendorAccountNumber,
      preferredPaymentMethod,
    } = this;

    const response = await app.createVendor({
      $,
      data: {
        id: vendorId,
        name,
        taxId,
        creditLimit,
        billingType,
        paymentPriority,
        status,
        isOnHold,
        doNotPay,
        notes,
        vendorAccountNumber,
        preferredPaymentMethod,
      },
    });

    $.export("$summary", "Successfully created vendor");
    return response;
  },
};
