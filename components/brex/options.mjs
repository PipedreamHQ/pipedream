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
