const DEFAULT_LIMIT = 25;

const PAYMENT_METHODS = [
  {
    label: "Credit Card",
    value: "CREDIT_CARD",
  },
  {
    label: "Paypal",
    value: "PAYPAL, APPLE_PAY",
  },
  {
    label: "Offline",
    value: "OFFLINE",
  },
  {
    label: "Custom",
    value: "CUSTOM",
  },
  {
    label: "Stripe Intent",
    value: "STRIPE_INTENT",
  },
  {
    label: "Facebook",
    value: "FACEBOOK",
  },
];

export default {
  DEFAULT_LIMIT,
  PAYMENT_METHODS,
};
