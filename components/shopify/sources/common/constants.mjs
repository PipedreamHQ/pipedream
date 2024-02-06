const DOMAIN_SUFFIX = ".myshopify.com";
const WEBHOOK_ID = "webhookId";

const HEADER = {
  SHOP_DOMAIN: "x-shopify-shop-domain",
  TOPIC: "x-shopify-topic",
};

const EVENT_TOPIC = {
  APP_UNINSTALLED: "app/uninstalled",
  BULK_OPERATIONS_FINISH: "bulk_operations/finish",
  COLLECTION_LISTINGS_ADD: "collection_listings/add",
  COLLECTION_LISTINGS_REMOVE: "collection_listings/remove",
  COLLECTION_LISTINGS_UPDATE: "collection_listings/update",
  COLLECTIONS_CREATE: "collections/create",
  COLLECTIONS_DELETE: "collections/delete",
  COLLECTIONS_UPDATE: "collections/update",
  DOMAINS_CREATE: "domains/create",
  DOMAINS_DESTROY: "domains/destroy",
  DOMAINS_UPDATE: "domains/update",
  INVENTORY_ITEMS_CREATE: "inventory_items/create",
  INVENTORY_ITEMS_DELETE: "inventory_items/delete",
  INVENTORY_ITEMS_UPDATE: "inventory_items/update",
  INVENTORY_LEVELS_CONNECT: "inventory_levels/connect",
  INVENTORY_LEVELS_DISCONNECT: "inventory_levels/disconnect",
  INVENTORY_LEVELS_UPDATE: "inventory_levels/update",
  LOCALES_CREATE: "locales/create",
  LOCALES_UPDATE: "locales/update",
  LOCATIONS_CREATE: "locations/create",
  LOCATIONS_DELETE: "locations/delete",
  LOCATIONS_UPDATE: "locations/update",
  MARKETS_CREATE: "markets/create",
  MARKETS_DELETE: "markets/delete",
  MARKETS_UPDATE: "markets/update",
  PRODUCT_LISTINGS_ADD: "product_listings/add",
  PRODUCT_LISTINGS_REMOVE: "product_listings/remove",
  PRODUCT_LISTINGS_UPDATE: "product_listings/update",
  PRODUCTS_CREATE: "products/create",
  PRODUCTS_DELETE: "products/delete",
  PRODUCTS_UPDATE: "products/update",
  REFUNDS_CREATE: "refunds/create",
  SCHEDULED_PRODUCT_LISTINGS_ADD: "scheduled_product_listings/add",
  SCHEDULED_PRODUCT_LISTINGS_REMOVE: "scheduled_product_listings/remove",
  SCHEDULED_PRODUCT_LISTINGS_UPDATE: "scheduled_product_listings/update",
  SELLING_PLAN_GROUPS_CREATE: "selling_plan_groups/create",
  SELLING_PLAN_GROUPS_DELETE: "selling_plan_groups/delete",
  SELLING_PLAN_GROUPS_UPDATE: "selling_plan_groups/update",
  SHOP_UPDATE: "shop/update",
  SUBSCRIPTION_CONTRACTS_CREATE: "subscription_contracts/create",
  SUBSCRIPTION_CONTRACTS_UPDATE: "subscription_contracts/update",
  THEMES_CREATE: "themes/create",
  THEMES_DELETE: "themes/delete",
  THEMES_PUBLISH: "themes/publish",
  EVENT_TOPICS_THEMES_UPDATE: "event-topics-themes-update",
  THEMES_UPDATE: "themes/update",
};

const EVENT_TOPICS = Object.values(EVENT_TOPIC);

export default {
  DOMAIN_SUFFIX,
  WEBHOOK_ID,
  HEADER,
  EVENT_TOPIC,
  EVENT_TOPICS,
};
