import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-update-vendor",
  name: "Update Vendor",
  description: "Updates an existing vendor by setting field values. Any fields not provided remain unchanged. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/vendors/tags/accounts_payable_vendors/paths/update-accounts-payable-vendor-key)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: false,
  },
  props: {
    app,
    vendorKey: {
      propDefinition: [
        app,
        "vendorKey",
      ],
    },
    name: {
      optional: true,
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
    discountPercent: {
      propDefinition: [
        app,
        "vendorDiscountPercent",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      vendorKey,
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
      discountPercent,
    } = this;

    const response = await app.updateVendor({
      $,
      vendorKey,
      data: {
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
        discountPercent,
      },
    });

    $.export("$summary", "Successfully updated vendor");
    return response;
  },
};
