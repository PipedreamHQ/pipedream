import app from "../../sage_intacct.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sage_intacct-create-bill",
  name: "Create Bill",
  description: "Creates a new bill. After you create a bill, it can be moved through the normal Accounts Payable workflow. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/bills/tags/accounts_payable_bills/paths/create-accounts-payable-bill)",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: false,
  },
  type: "action",
  props: {
    app,
    billNumber: {
      propDefinition: [
        app,
        "billNumber",
      ],
    },
    vendorId: {
      propDefinition: [
        app,
        "vendorId",
      ],
    },
    referenceNumber: {
      propDefinition: [
        app,
        "referenceNumber",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    createdDate: {
      propDefinition: [
        app,
        "createdDate",
      ],
    },
    postingDate: {
      propDefinition: [
        app,
        "postingDate",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
    discountCutOffDate: {
      propDefinition: [
        app,
        "discountCutOffDate",
      ],
    },
    recommendedPaymentDate: {
      propDefinition: [
        app,
        "recommendedPaymentDate",
      ],
    },
    paymentPriority: {
      propDefinition: [
        app,
        "paymentPriority",
      ],
    },
    isOnHold: {
      propDefinition: [
        app,
        "isOnHold",
      ],
    },
    isTaxInclusive: {
      propDefinition: [
        app,
        "isTaxInclusive",
      ],
    },
    txnCurrency: {
      propDefinition: [
        app,
        "txnCurrency",
      ],
    },
    lines: {
      propDefinition: [
        app,
        "lines",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      billNumber,
      vendorId,
      referenceNumber,
      description,
      createdDate,
      postingDate,
      dueDate,
      discountCutOffDate,
      recommendedPaymentDate,
      paymentPriority,
      isOnHold,
      isTaxInclusive,
      txnCurrency,
      lines,
    } = this;

    const response = await app.createBill({
      $,
      data: {
        billNumber,
        referenceNumber,
        description,
        postingDate,
        discountCutOffDate,
        recommendedPaymentDate,
        paymentPriority,
        isOnHold,
        isTaxInclusive,
        createdDate,
        dueDate,
        ...(vendorId && {
          vendor: {
            id: vendorId,
          },
        }),
        ...(txnCurrency && {
          currency: {
            txnCurrency,
          },
        }),
        lines: utils.parseJson(lines),
      },
    });

    $.export("$summary", "Successfully created bill");
    return response;
  },
};
