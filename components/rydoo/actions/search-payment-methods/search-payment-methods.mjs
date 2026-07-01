import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-search-payment-methods",
  name: "Search Payment Methods",
  description: "Finds payment methods by type, branch, card type, status, and more. [See the documentation](https://web-services.rydoo.com/index.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    search: {
      type: "string",
      label: "Search",
      description: "Filter payment methods where the name or ID contains this string",
      optional: true,
    },
    accountType: {
      type: "string[]",
      label: "Account Type",
      description: "Filter by one or more payment method types",
      optional: true,
      options: [
        "Cash",
        "DebetCard",
        "CreditCard",
        "Transfer",
        "Paypal",
        "Prepaid",
        "Cheque",
        "AmericanExpress",
        "LodgeCard",
        "Kbc",
        "PurchaseCard",
        "Rydoo",
        "UbsVirtualCard",
        "CashAdvance",
      ],
    },
    branchId: {
      propDefinition: [
        rydoo,
        "branchIds",
      ],
      type: "string",
      label: "Branch ID",
      description: "Filter by branch ID",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active (`true`) or inactive (`false`) payment methods. Defaults to all",
      optional: true,
    },
    validationStatus: {
      type: "string[]",
      label: "Validation Status",
      description: "Filter by one or more validation statuses (e.g., `Pending`, `Valid`, `Failed`)",
      optional: true,
    },
    isReimbursable: {
      type: "boolean",
      label: "Is Reimbursable",
      description: "Filter by reimbursable (`true`) or non-reimbursable (`false`) payment methods. Defaults to all",
      optional: true,
    },
    cardNumber: {
      type: "string",
      label: "Card Number",
      description: "Filter by card number",
      optional: true,
    },
    cardType: {
      type: "string[]",
      label: "Card Type",
      description: "Filter by one or more card types",
      optional: true,
      options: [
        "MultipleUse",
        "SingleUse",
        "Physical",
      ],
    },
    accountOwnership: {
      type: "string[]",
      label: "Account Ownership",
      description: "Filter by one or more account ownership values",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of payment methods to return per page (defaults to `50`)",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of payment methods to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listPaymentMethods({
      $,
      params: {
        AccountType: this.accountType,
        BranchId: this.branchId,
        IsActive: this.isActive,
        ValidationStatus: this.validationStatus,
        IsReimbursable: this.isReimbursable,
        CardNumber: this.cardNumber,
        CardType: this.cardType,
        AccountOwnership: this.accountOwnership,
        Sort: this.sort,
        Search: this.search,
        Limit: this.limit,
        Offset: this.offset,
      },
    });

    const paymentMethods = response?.data || response;
    const count = Array.isArray(paymentMethods)
      ? paymentMethods.length
      : 0;
    $.export("$summary", `Successfully found ${count} payment method${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
