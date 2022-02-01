export default {
  option: {
    type: "string",
    label: "Title",
    description: "The option name of the product variant",
  },
  price: {
    type: "string",
    label: "Price",
    description: "The price of the product variant",
    optional: true,
  },
  imageId: {
    type: "string",
    label: "Image ID",
    description: "The unique numeric identifier for a product's image. The image must be associated to the same product as the variant",
    optional: true,
  },
};
