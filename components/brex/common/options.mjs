export default {
  limitType: [
    "CARD",
    "USER",
  ],
  cardType: [
    "VIRTUAL",
    "PHYSICAL",
  ],
  cardStatus: [
    {
      label: "ACTIVE: The card can be used for purchases",
      value: "ACTIVE",
    },
    {
      label: "SHIPPED: A physical card that has been mailed but not yet activated",
      value: "SHIPPED",
    },
    {
      label: "LOCKED: The card is frozen and will decline purchases",
      value: "LOCKED",
    },
    {
      label: "TERMINATED: The card has been cancelled permanently",
      value: "TERMINATED",
    },
  ],
  cardActionReason: [
    "CARD_DAMAGED",
    "CARD_LOST",
    "CARD_NOT_RECEIVED",
    "DO_NOT_NEED_PHYSICAL_CARD",
    "DO_NOT_NEED_VIRTUAL_CARD",
    "FRAUD",
    "OTHER",
  ],
  expenseType: [
    "CARD",
    "BILLPAY",
    "REIMBURSEMENT",
    "CLAWBACK",
    "UNSET",
  ],
  expenseStatus: [
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "OUT_OF_POLICY",
    "VOID",
    "CANCELED",
    "SPLIT",
    "SETTLED",
  ],
  expensePaymentStatus: [
    "NOT_STARTED",
    "PROCESSING",
    "CANCELED",
    "DECLINED",
    "CLEARED",
    "REFUNDING",
    "REFUNDED",
    "CASH_ADVANCE",
    "CREDITED",
    "AWAITING_PAYMENT",
    "SCHEDULED",
  ],
  expenseExpand: [
    "merchant",
    "receipts.download_uris",
    "user",
    "budget",
    "location",
    "department",
    "payment",
    "policy",
    "spending_entity",
    "cost_center",
  ],
  spendDuration: [
    {
      label: "MONTHLY: The spend limit refreshes every month",
      value: "MONTHLY",
    },
    {
      label: "QUARTERLY: The spend limit refreshes every quarter",
      value: "QUARTERLY",
    },
    {
      label: "YEARLY: The spend limit refreshes every year",
      value: "YEARLY",
    },
    {
      label: "ONE_TIME: The limit does not refresh",
      value: "ONE_TIME",
    },
  ],
};
