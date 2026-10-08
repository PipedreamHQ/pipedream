import constants from "../../common/constants.mjs";
import {
  cleanObject,
  formatAspects,
  parseArray,
} from "../../common/utils.mjs";
import ebay from "../../ebay.app.mjs";

export default {
  key: "ebay-create-inventory-item",
  name: "Create or Replace Inventory Item",
  description: "Creates or replaces an inventory item record for a given SKU (Stock Keeping Unit) in the eBay inventory catalog. This is the first step in creating a new eBay listing. After creating an inventory item, pass the SKU to **Create Unpublished Offer** to create a listing offer. [See the documentation](https://developer.ebay.com/api-docs/sell/inventory/resources/inventory_item/methods/createOrReplaceInventoryItem)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ebay,
    sku: {
      propDefinition: [
        ebay,
        "sku",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the product.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the product (plain text or HTML).",
    },
    condition: {
      propDefinition: [
        ebay,
        "condition",
      ],
    },
    conditionDescription: {
      type: "string",
      label: "Condition Description",
      description: "A detailed description of the item's condition, especially if used.",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Available Quantity",
      description: "The total available quantity of the item.",
      default: 1,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "List of image URLs for the product.",
    },
    aspects: {
      type: "object",
      label: "Item Specifics / Aspects",
      description: "Key-value pairs of item specifics (e.g. `{\"Brand\": \"Nike\", \"Color\": \"Red\", \"Size\": \"10\"}`).",
      optional: true,
    },
    brand: {
      type: "string",
      label: "Brand",
      description: "The brand of the product.",
      optional: true,
    },
    mpn: {
      type: "string",
      label: "MPN",
      description: "The Manufacturer Part Number (MPN).",
      optional: true,
    },
    upc: {
      type: "string[]",
      label: "UPC",
      description: "Universal Product Code(s) for the product.",
      optional: true,
    },
    isbn: {
      type: "string[]",
      label: "ISBN",
      description: "International Standard Book Number(s) for the product.",
      optional: true,
    },
    ean: {
      type: "string[]",
      label: "EAN",
      description: "European Article Number(s) for the product.",
      optional: true,
    },
    packageWeight: {
      type: "string",
      label: "Package Weight",
      description: "The weight of the packaged item.",
      optional: true,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "The unit of measurement for weight.",
      options: constants.WEIGHT_UNIT_OPTIONS,
      default: "POUND",
      optional: true,
    },
    packageLength: {
      type: "string",
      label: "Package Length",
      description: "The length dimension of the packaged item.",
      optional: true,
    },
    packageWidth: {
      type: "string",
      label: "Package Width",
      description: "The width dimension of the packaged item.",
      optional: true,
    },
    packageHeight: {
      type: "string",
      label: "Package Height",
      description: "The height dimension of the packaged item.",
      optional: true,
    },
    dimensionUnit: {
      type: "string",
      label: "Dimension Unit",
      description: "The unit of measurement for dimensions.",
      options: constants.DIMENSION_UNIT_OPTIONS,
      default: "INCH",
      optional: true,
    },
    packageType: {
      type: "string",
      label: "Package Type",
      description: "The packaging type used for shipping.",
      options: constants.PACKAGE_TYPE_OPTIONS,
      optional: true,
    },
    contentLanguage: {
      propDefinition: [
        ebay,
        "contentLanguage",
      ],
    },
  },
  async run({ $ }) {
    const {
      sku,
      title,
      description,
      condition,
      conditionDescription,
      quantity,
      imageUrls,
      aspects,
      brand,
      mpn,
      upc,
      isbn,
      ean,
      packageWeight,
      weightUnit,
      packageLength,
      packageWidth,
      packageHeight,
      dimensionUnit,
      packageType,
      contentLanguage,
    } = this;

    const formattedAspects = formatAspects(aspects) || {};
    if (brand && !formattedAspects.Brand) {
      formattedAspects.Brand = [
        brand,
      ];
    }

    const payload = cleanObject({
      availability: {
        shipToLocationAvailability: {
          quantity: Number(quantity),
        },
      },
      condition,
      conditionDescription,
      product: {
        title,
        description,
        aspects: Object.keys(formattedAspects).length > 0
          ? formattedAspects
          : undefined,
        imageUrls: parseArray(imageUrls),
        brand,
        mpn,
        upc: parseArray(upc),
        isbn: parseArray(isbn),
        ean: parseArray(ean),
      },
      packageWeightAndSize: (packageWeight || (packageLength && packageWidth && packageHeight) || packageType)
        ? {
          dimensions: (packageLength && packageWidth && packageHeight)
            ? {
              length: Number(packageLength),
              width: Number(packageWidth),
              height: Number(packageHeight),
              unit: dimensionUnit || "INCH",
            }
            : undefined,
          weight: packageWeight
            ? {
              value: Number(packageWeight),
              unit: weightUnit || "POUND",
            }
            : undefined,
          packageType,
        }
        : undefined,
    });

    const response = await this.ebay.createOrReplaceInventoryItem({
      $,
      sku,
      contentLanguage,
      data: payload,
    });

    $.export("$summary", `Successfully created/updated inventory item with SKU: ${sku}`);

    return response || {
      sku,
      success: true,
    };
  },
};
