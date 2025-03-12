const API_VERSION = "2025-01";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 250;

const PRODUCT_SORT_KEY = [
  "CREATED_AT",
  "ID",
  "INVENTORY_TOTAL",
  "PRODUCT_TYPE",
  "PUBLISHED_AT",
  "RELEVANCE",
  "TITLE",
  "UPDATED_AT",
  "VENDOR",
];

const COLLECTION_SORT_KEY = [
  "ID",
  "RELEVANCE",
  "TITLE",
  "UPDATED_AT",
];

const COLLECTION_RULE_COLUMNS = [
  "IS_PRICE_REDUCED",
  "PRODUCT_CATEGORY_ID",
  "PRODUCT_METAFIELD_DEFINITION",
  "PRODUCT_TAXONOMY_NODE_ID",
  "TAG",
  "TITLE",
  "TYPE",
  "VARIANT_COMPARE_AT_PRICE",
  "VARIANT_INVENTORY",
  "VARIANT_METAFIELD_DEFINITION",
  "VARIANT_PRICE",
  "VARIANT_TITLE",
  "VARIANT_WEIGHT",
  "VENDOR",
];

const COLLECTION_RULE_RELATIONS = [
  "CONTAINS",
  "ENDS_WITH",
  "EQUALS",
  "GREATER_THAN",
  "IS_NOT_SET",
  "IS_SET",
  "LESS_THAN",
  "NOT_CONTAINS",
  "NOT_EQUALS",
  "STARTS_WITH",
];

const WEIGHT_UNITS = [
  "KILOGRAMS",
  "GRAMS",
  "POUNDS",
  "OUNCES",
];

const INVENTORY_ADJUSTMENT_REASONS = [
  {
    value: "correction",
    label: "Used to correct an inventory error or as a general adjustment reason",
  },
  {
    value: "cycle_count_available",
    label: "Used to specify an adjusted inventory count due to a discrepancy between the actual inventory quantity and previously recorded inventory quantity",
  },
  {
    value: "damaged",
    label: "Used to remove units from inventory count due to damage",
  },
  {
    value: "movement_created",
    label: "Used to specify that an inventory transfer or a purchase order has been created",
  },
  {
    value: "movement_updated",
    label: "Used to specify that an inventory transfer or a purchase order has been updated",
  },
  {
    value: "movement_received",
    label: "Used to specify that an inventory transfer or a purchase order has been received",
  },
  {
    value: "movement_canceled",
    label: "Used to specify that an inventory transfer or a purchase order has been canceled",
  },
  {
    value: "other",
    label: "Used to specify an alternate reason for the inventory adjustment",
  },
  {
    value: "promotion",
    label: "Used to remove units from inventory count due to a promotion or donation",
  },
  {
    value: "quality_control",
    label: "Used to specify that on-hand units that aren't sellable because they're currently in inspection for quality purposes",
  },
  {
    value: "received",
    label: "Used to specify inventory that the merchant received",
  },
  {
    value: "reservation_created",
    label: "Used to reserve, or temporarily set aside unavailable units",
  },
  {
    value: "reservation_deleted",
    label: "Used to remove the number of unavailable units that have been reserved",
  },
  {
    value: "reservation_updated",
    label: "Used to update the number of unavailable units that have been reserved",
  },
  {
    value: "restock",
    label: "Used to add a returned unit back to available inventory so the unit can be resold",
  },
  {
    value: "safety_stock",
    label: "Used to specify that on-hand units are being set aside to help guard against overselling",
  },
  {
    value: "shrinkage",
    label: "Used when actual inventory levels are less than recorded due to theft or loss",
  },
];

export {
  API_VERSION,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  PRODUCT_SORT_KEY,
  COLLECTION_SORT_KEY,
  COLLECTION_RULE_COLUMNS,
  COLLECTION_RULE_RELATIONS,
  WEIGHT_UNITS,
  INVENTORY_ADJUSTMENT_REASONS,
};
