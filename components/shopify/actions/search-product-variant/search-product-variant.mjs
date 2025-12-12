import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "shopify-search-product-variant",
  name: "Search for Product Variant",
  description: "Search for product variants or create one if not found. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/productVariants)",
  version: "0.0.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    productVariantId: {
      propDefinition: [
        shopify,
        "productVariantId",
        (c) => ({
          productId: c.productId,
        }),
      ],
      description: "ID of the product variant. Takes precedence over **Title**",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the product variant",
      optional: true,
    },
    createIfNotFound: {
      type: "boolean",
      label: "Create If Not Found",
      description: "Creates the product variant with **Title** and the fields below if not found",
      optional: true,
      default: false,
      reloadProps: true,
    },
    optionIds: {
      propDefinition: [
        shopify,
        "productOptionIds",
        (c) => ({
          productId: c.productId,
        }),
      ],
      hidden: true,
    },
  },
  async additionalProps(existingProps) {
    let props = {};
    if (this.createIfNotFound) {
      existingProps.optionIds.hidden = false;
      props.price = {
        type: "string",
        label: "Price",
        description: "The price of the product variant",
        optional: true,
      };
      props.image = {
        type: "string",
        label: "Image URL",
        description: "The URL of an image to attach to the product variant",
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getOptionValues() {
      const { product: { options } } = await this.shopify.getProduct({
        id: this.productId,
        first: MAX_LIMIT,
      });
      const productOptions = {};
      for (const option of options) {
        for (const optionValue of option.optionValues) {
          productOptions[optionValue.id] = option.id;
        }
      }
      const optionValues = this.optionIds.map((id) => ({
        id,
        optionId: productOptions[id],
      }));
      return optionValues;
    },
  },
  async run({ $ }) {
    if (!(this.productVariantId || this.title)) {
      throw new ConfigurationError("Required field missing: Fill in `Product Variant ID` or `Title`");
    }

    let response;
    try {
      if (this.productVariantId) {
        response = await this.shopify.getProductVariant({
          id: this.productVariantId,
          first: MAX_LIMIT,
        });
      } else {
        response = await this.shopify.listProductVariants({
          query: `product_id:${utils.getIdFromGid(this.productId)} AND title:${JSON.stringify(this.title)}`,
          first: MAX_LIMIT,
        });
      }

      const variant = response?.productVariants?.nodes?.length
        ? response.productVariants.nodes[0]
        : response?.productVariant
          ? response.productVariant
          : {};

      const title = variant?.title;
      const id = variant?.id;

      if (title && id) {
        $.export("$summary", `Found product variant \`${title}\` with ID \`${id}\``);
      } else {
        throw new Error("No product variant found");
      }
    } catch (err) {
      if (!this.createIfNotFound) {
        $.export("$summary", "No product variant found");
        return;
      }

      response = await this.shopify.createProductVariants({
        productId: this.productId,
        variants: [
          {
            optionValues: this.optionIds && await this.getOptionValues(),
            price: this.price,
            mediaSrc: this.image,
          },
        ],
      });
      if (response.productVariantsBulkCreate.userErrors.length > 0) {
        throw new Error(response.productVariantsBulkCreate.userErrors[0].message);
      }
      $.export("$summary", `Created new product variant \`${response.productVariantsBulkCreate.productVariants.title}\` with ID \`${response.productVariantsBulkCreate.productVariants.id}\``);
    }
    return response;
  },
};
