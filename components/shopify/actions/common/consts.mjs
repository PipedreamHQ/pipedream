const RESOURCE_TYPES = [
  {
    label: "Blog",
    value: "blog",
  },
  {
    label: "Collection",
    value: "collection",
  },
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Draft Order",
    value: "draft_order",
  },
  {
    label: "Page",
    value: "page",
  },
  {
    label: "Product",
    value: "product",
  },
  {
    label: "Product Image",
    value: "product_image",
  },
  {
    label: "Product Variant",
    value: "variants",
  },
  {
    label: "Article",
    value: "article",
  },
  {
    label: "Order",
    value: "order",
  },
];

const METAFIELD_TYPES = {
  "boolean": "boolean",
  "collection_reference": "string",
  "color": "string",
  "date": "string",
  "date_time": "string",
  "dimension": "object",
  "file_reference": "string",
  "json": "object",
  "metaobject_reference": "string",
  "mixed_reference": "string",
  "money": "object",
  "multi_line_text_field": "string",
  "number_decimal": "string",
  "number_integer": "integer",
  "page_reference": "string",
  "product_reference": "string",
  "rating": "object",
  "single_line_text_field": "string",
  "url": "string",
  "variant_reference": "string",
  "volume": "object",
  "weight": "object",
  "list.collection_reference": "string[]",
  "list.color": "string[]",
  "list.date": "string[]",
  "list.date_time": "string[]",
  "list.dimension": "string[]",
  "list.file_reference": "string[]",
  "list.metaobject_reference": "string[]",
  "list.mixed_reference": "string[]",
  "list.number_integer": "string[]",
  "list.number_decimal": "string[]",
  "list.page_reference": "string[]",
  "list.product_rererence": "string[]",
  "list.rating": "string[]",
  "list.single_line_text_field": "string[]",
  "list.url": "string[]",
  "list.variant_reference": "string[]",
  "list.volume": "string[]",
  "list.weight": "string[]",
};

export default {
  RESOURCE_TYPES,
  METAFIELD_TYPES,
};
