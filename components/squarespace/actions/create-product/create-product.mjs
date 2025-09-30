import squarespace from "../../squarespace.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "squarespace-create-product",
  name: "Create Product",
  description: "Create a new product. [See docs here](https://developers.squarespace.com/commerce-apis/create-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    squarespace,
    storePageId: {
      propDefinition: [
        squarespace,
        "storePageId",
      ],
    },
    variants: {
      label: "Variants",
      description: "The variants of the product. Array must contain at least one object but no more than 100 objects. E.g `[ { \"sku\": \"SQ0557856\", \"pricing\": { \"basePrice\": { \"currency\": \"USD\", \"value\": \"12.95\" }, \"onSale\": false, \"salePrice\": { \"currency\": \"USD\", \"value\": \"0.00\" } }, \"stock\": { \"quantity\": 10, \"unlimited\": false }, \"attributes\": { \"Flavor\": \"Habanero\" }, \"shippingMeasurements\": { \"weight\": { \"unit\": \"POUND\", \"value\": 2.0 }, \"dimensions\": { \"unit\": \"INCH\", \"length\": 7.0, \"width\": 5.0, \"height\": 5.0 } } } ]`",
      type: "string",
    },
    name: {
      label: "Name",
      description: "The name of the product. 200 char limit",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "The description of the product. 102,400 char limit",
      type: "string",
      optional: true,
    },
    urlSlug: {
      label: "URL Slug",
      description: "The URL slug of the product. E.g `artisanal-steak-dry-rub`",
      type: "string",
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "The tags of the product. E.g `[\"artisanal\", \"steak\"]`",
      type: "string[]",
      optional: true,
    },
    variantAttributes: {
      label: "Variant Attributes",
      description: "The variants attributes of the product. E.g `[\"Flavor\"]`",
      type: "string[]",
      optional: true,
    },
  },
  methods: {},
  async run({ $ }) {
    const response = await this.squarespace.createProduct({
      $,
      data: {
        type: "PHYSICAL",
        storePageId: this.storePageId,
        name: this.name,
        description: this.description,
        urlSlug: this.urlSlug,
        variants: utils.parseStringToJSON(this.variants, this.variants),
        variantAttributes: utils.parseStringToJSON(this.variantAttributes, this.variantAttributes),
        tags: utils.parseStringToJSON(this.tags, this.tags),
      },
    });

    $.export("$summary", "Successfully created product.");

    return response;
  },
};
