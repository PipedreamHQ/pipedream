import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-create-product",
  name: "Create Product",
  description: "Create a new product. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new product",
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "A description of the product. Supports HTML formatting. Example: `<strong>Good snowboard!</strong>`",
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
      description: "The status of the product. `active`: The product is ready to sell and is available to customers on the online store, sales channels, and apps. By default, existing products are set to active. `archived`: The product is no longer being sold and isn't available to customers on sales channels and apps. `draft`: The product isn't ready to sell and is unavailable to customers on sales channels and apps. By default, duplicated and unarchived products are set to draft",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "DRAFT",
      ],
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "A list of URLs of images to associate with the new product",
      optional: true,
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "The custom product properties. For example, Size, Color, and Material. Each product can have up to 3 options and each option value can be up to 255 characters. Product variants are made of up combinations of option values. Options cannot be created without values. To create new options, a variant with an associated option value also needs to be created. Example: `[{\"name\":\"Color\",\"values\":[{\"name\": \"Blue\"},{\"name\": \"Black\"}]},{\"name\":\"Size\",\"values\":[{\"name\": \"155\"},{\"name\": \"159\"}]}]`",
      optional: true,
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createProduct({
      product: {
        title: this.title,
        descriptionHtml: this.productDescription,
        vendor: this.vendor,
        productType: this.productType,
        status: this.status,
        productOptions: this.options && utils.parseJson(this.options),
        tags: this.tags,
      },
      media: this.images && this.images.map((image) => ({
        mediaContentType: "IMAGE",
        originalSource: image,
      })),
    });
    if (response.productCreate.userErrors.length > 0) {
      throw new Error(response.productCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new product \`${this.title}\` with id \`${response.productCreate.product.id}\``);
    return response;
  },
};
