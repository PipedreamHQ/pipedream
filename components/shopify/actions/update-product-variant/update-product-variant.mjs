import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";
import {
  MAX_LIMIT, WEIGHT_UNITS,
} from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "shopify-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productVariantsBulkUpdate)",
  version: "0.0.17",
  annotations: {
    destructiveHint: true,
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
    },
    optionIds: {
      propDefinition: [
        shopify,
        "productOptionIds",
        (c) => ({
          productId: c.productId,
        }),
      ],
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the product variant",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "The URL of an image to be added to the product variant",
      optional: true,
    },
    sku: {
      type: "string",
      label: "Sku",
      description: "A unique identifier for the product variant in the shop",
      optional: true,
    },
    barcode: {
      type: "string",
      label: "Barcode",
      description: "The barcode, UPC, or ISBN number for the product",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "The weight of the product variant in the unit system specified with Weight Unit",
      optional: true,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "The unit of measurement that applies to the product variant's weight. If you don't specify a value for weight_unit, then the shop's default unit of measurement is applied.",
      optional: true,
      options: WEIGHT_UNITS,
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
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
    if ((this.weightUnit && !this.weight) || (!this.weightUnit && this.weight)) {
      throw new ConfigurationError("Must enter both Weight and Weight Unit to set weight");
    }

    const response = await this.shopify.updateProductVariant({
      productId: this.productId,
      variants: [
        {
          id: this.productVariantId,
          optionValues: this.optionIds && await this.getOptionValues(),
          price: this.price,
          mediaSrc: this.image,
          barcode: this.barcode,
          inventoryItem: (this.sku || this.weightUnit || this.weight) && {
            sku: this.sku,
            measurement: (this.weightUnit || this.weight) && {
              weight: {
                unit: this.weightUnit,
                value: +this.weight,
              },
            },
          },
          metafields: this.metafields && utils.parseJson(this.metafields),
        },
      ],
    });
    if (response.productVariantsBulkUpdate.userErrors.length > 0) {
      throw new Error(response.productVariantsBulkUpdate.userErrors[0].message);
    }
    $.export("$summary", `Created new product variant \`${response.productVariantsBulkUpdate.productVariants[0].title}\` with ID \`${response.productVariantsBulkUpdate.productVariants[0].id}\``);
    return response;
  },
};
