const BASE_URL = "https://api.bigcommerce.com/stores";

const WEBHOOK_SCOPES = {
  cart: {
    channel: [
      "*",
      "created",
      "updated",
      "deleted",
      "couponApplied",
      "abandoned",
      "converted",
      "lineitem/*",
      "lineitem/created",
      "lineitem/updated",
      "lineitem/deleted",
    ],
    default: [
      "*",
      "created",
      "updated",
      "deleted",
      "couponApplied",
      "abandoned",
      "converted",
      "lineitem/*",
      "lineitem/created",
      "lineitem/updated",
      "lineitem/deleted",
    ],
  },
  category: {
    channel: [
      "*",
      "created",
      "updated",
      "deleted",
      "product/assigned",
      "product/unassigned",
    ],
    default: [
      "*",
      "created",
      "updated",
      "deleted",
    ],
  },
  categoryTree: {
    channel: [
      "updated",
    ],
  },
  customer: {
    default: [
      "*",
      "created",
      "updated",
      "deleted",
      "address/created",
      "address/updated",
      "address/deleted",
      "payment/instrument/default/updated",
      "channel/login/access/updated",
    ],
  },
  email: {
    channel: [
      "templates/updated",
      "templates/deleted",
    ],
  },
  notifications: {
    channel: [
      "abandonedCart/updated",
      "inventory/updated",
    ],
  },
  order: {
    channel: [
      "*",
      "created",
      "updated",
      "archived",
      "statusUpdated",
      "message/created",
      "refund/created",
    ],
    default: [
      "*",
      "created",
      "updated",
      "archived",
      "statusUpdated",
      "message/created",
      "refund/created",
      "transaction/created",
      "transaction/updated",
    ],
  },
  page: {
    channel: [
      "created",
      "updated",
    ],
  },
  priceList: {
    channel: [
      "assignment/updated",
    ],
  },
  product: {
    channel: [
      "assigned",
      "unassigned",
    ],
    default: [
      "*",
      "created",
      "updated",
      "deleted",
      "inventory/updated",
      "inventory/order/updated",
    ],
  },
  settings: {
    channel: [
      "*",
      "emailStatus/updated",
      "emailStatus/deleted",
      "route/updated",
      "profile/updated",
      "logo/updated",
      "logo/image/updated",
      "favicon/image/updated",
      "checkout/updated",
      "SEO/updated",
      "robots/updated",
      "category/updated",
      "product/updated",
      "catalog/updated",
      "security/updated",
      "searchContextFilters/updated",
      "defaultCustomerGroup/updated",
      "customerPrivacy/updated",
      "site/updated",
    ],
  },
  script: {
    channel: [
      "created",
      "updated",
    ],
  },
  shipment: {
    default: [
      "*",
      "created",
      "updated",
      "deleted",
    ],
  },
  sku: {
    default: [
      "*",
      "created",
      "updated",
      "deleted",
      "inventory/updated",
      "inventory/order/updated",
    ],
  },
  socialMediaLinks: {
    channel: [
      "updated",
    ],
  },
  subscriber: {
    default: [
      "*",
      "created",
      "updated",
      "deleted",
    ],
  },
  theme: {
    channel: [
      "configuration/created",
      "configuration/activated",
    ],
  },
};

export default {
  BASE_URL,
  WEBHOOK_SCOPES,
};
