import app from "../../sage_intacct.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sage_intacct-update-bill",
  name: "Update Bill",
  description: "Updates an existing bill by setting field values. Any fields not provided remain unchanged. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/bills/tags/accounts_payable_bills/paths/update-accounts-payable-bill-key)",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  type: "action",
  props: {
    app,
    billKey: {
      propDefinition: [
        app,
        "billKey",
      ],
    },
    billNumber: {
      propDefinition: [
        app,
        "billNumber",
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
    postingDate: {
      propDefinition: [
        app,
        "postingDate",
      ],
    },
    dueDate: {
      optional: true,
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
      billKey,
      billNumber,
      referenceNumber,
      description,
      postingDate,
      dueDate,
      discountCutOffDate,
      recommendedPaymentDate,
      paymentPriority,
      isOnHold,
      isTaxInclusive,
      lines,
    } = this;

    const response = await app.updateBill({
      $,
      billKey,
      data: {
        billNumber,
        referenceNumber,
        description,
        postingDate,
        dueDate,
        discountCutOffDate,
        recommendedPaymentDate,
        paymentPriority,
        isOnHold,
        isTaxInclusive,
        lines: utils.parseJson(lines),
      },
    });

    $.export("$summary", "Successfully updated bill");
    return response;
  },
};
