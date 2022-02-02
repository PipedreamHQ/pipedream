import { toSingleLineString } from "./commons.mjs";

export default {
  title: {
    type: "string",
    label: "Title",
    description: "The name of the product",
  },
  productDescription: {
    type: "string",
    label: "Product Description",
    description: "A description of the product. Supports HTML formatting. Example: `<strong>Good snowboard!</strong>`",
    optional: true,
  },
  price: {
    type: "string",
    label: "Price",
    description: "The price of the product",
    optional: true,
  },
  vendor: {
    type: "string",
    label: "Vendor",
    description: "The name of the product's vendor",
    optional: true,
  },
  productType: {
    type: "string",
    label: "Product Type",
    description: "A categorization for the product used for filtering and searching products",
    optional: true,
  },
  status: {
    type: "string",
    label: "Status",
    description: toSingleLineString(`
      The status of the product.
      \`active\`: The product is ready to sell and is available to customers on the online store, sales channels, and apps. By default, existing products are set to active.
      \`archived\`: The product is no longer being sold and isn't available to customers on sales channels and apps.
      \`draft\`: The product isn't ready to sell and is unavailable to customers on sales channels and apps. By default, duplicated and unarchived products are set to draft
    `),
    optional: true,
    options: [
      "active",
      "archived",
      "draft",
    ],
  },
  images: {
    type: "string[]",
    label: "Images",
    description: toSingleLineString(`
      A list of product base64 encoded image objects.
      Each one represents an image associated with the product or a link that will be downloaded by Shopify.
      Example: \`["R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==","http://example.com/rails_logo.gif"]\`.
      More information at [Shopify Product API](https://shopify.dev/api/admin-rest/2022-01/resources/product#[post]/admin/api/2022-01/products.json)
    `),
    optional: true,
  },
  options: {
    type: "string[]",
    label: "Options",
    description: toSingleLineString(`
      The custom product properties.
      For example, Size, Color, and Material. Each product can have up to 3 options and each option value can be up to 255 characters.
      Product variants are made of up combinations of option values. Options cannot be created without values.
      To create new options, a variant with an associated option value also needs to be created.
      Example: \`[{"name":"Color","values":["Blue","Black"]},{"name":"Size","values":["155","159"]}]\`
    `),
    optional: true,
  },
  variants: {
    type: "string[]",
    label: "Product Variants",
    description: toSingleLineString(`
      An array of product variants, each representing a different version of the product.
      The position property is read-only. The position of variants is indicated by the order in which they are listed.
      Example: \`[{"option1":"First","price":"10.00","sku":"123"},{"option1":"Second","price":"20.00","sku":"123"}]\`
    `),
    optional: true,
  },
  tags: {
    type: "string[]",
    label: "Tags",
    description: toSingleLineString(`
      A string of comma-separated tags that are used for filtering and search. A product can have up to 250 tags. Each tag can have up to 255 characters.
      Example: \`"Barnes & Noble","Big Air","John's Fav"\`
    `),
    optional: true,
  },
};
