export default {
  limitType: [
    "CARD",
    "USER",
  ],
  cardType: [
    "VIRTUAL",
    "PHYSICAL",
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
