export default {
  BASE_URL: "https://api.tiendanube.com",
  VERSION_PATH: "/2025-03",
  DEFAULT_LIMIT: 30,
  ORDER_STATUS: [
    "any",
    "open",
    "closed",
    "cancelled",
  ],
  PAYMENT_STATUS: [
    "any",
    "pending",
    "authorized",
    "paid",
    "voided",
    "refunded",
    "abandoned",
  ],
  SHIPPING_STATUS: [
    {
      label: "Any",
      value: "any",
    },
    {
      label: "Unpacked",
      value: "unpacked",
    },
    {
      label: "Unfulfilled",
      value: "unfulfilled",
    },
    {
      label: "Shipped",
      value: "fulfilled",
    },
    {
      label: "Unshipped",
      value: "unfulfilled",
    },
  ],
};
