const DEFAULT_LIMIT = 20;

const SEND_METHODS = [
  {
    value: "email_and_link",
    label: "Sends a gift email to the recipient",
  },
  {
    value: "link_multiple_custom_list",
    label: "Generates a gift link without an automatic email",
  },
  {
    value: "direct_send",
    label: "Ships the product directly to the recipient (must specify mailing address)",
  },
];

export default {
  DEFAULT_LIMIT,
  SEND_METHODS,
};
