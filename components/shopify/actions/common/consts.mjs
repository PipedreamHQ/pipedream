const RESOURCE_TYPES = [
  "blog",
  "collection",
  "customer",
  "draft_order",
  "page",
  "product",
  "product_image",
  "variants",
  "article",
  "order",
];

const METAFIELD_TYPES = {
  boolean: "boolean",
  collection_reference: "string",
  color: "string",
  date: "string",
  date_time: "string",
  dimension: "object",
  file_reference: "string",
  json: "object",
  metaobject_reference: "string",
  mixed_reference: "string",
  money: "object",
  multi_line_text_field: "string",
  number_decimal: "string",
  number_integer: "integer",
  page_reference: "string",
  product_reference: "string",
  rating: "object",
  single_line_text_field: "string",
  url: "string",
  variant_reference: "string",
  volume: "object",
  weight: "object",
};

export default {
  RESOURCE_TYPES,
  METAFIELD_TYPES,
};
