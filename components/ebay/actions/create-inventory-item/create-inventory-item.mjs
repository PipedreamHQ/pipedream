import { ConfigurationError } from "@pipedream/platform";
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
    destructiveHint: true,
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
      description: "The title of the product (e.g. `Men's Running Shoes - Size 10`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the product in plain text or HTML (e.g. `Brand new running shoes with cushioned soles.`).",
    },
    condition: {
      propDefinition: [
        ebay,
        "condition",
      ],
      optional: true,
    },
    conditionDescription: {
      type: "string",
      label: "Condition Description",
      description: "A detailed description of the item's condition, especially if used (e.g. `Minor cosmetic wear on the outer box, item in pristine condition.`).",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Available Quantity",
      description: "The total available quantity of the item (e.g. `10`).",
      optional: true,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "List of public image URLs for the product (e.g. `[\"https://example.com/image1.jpg\"]`).",
    },
    aspects: {
      type: "object",
      label: "Item Specifics / Aspects",
      description: "Key-value pairs of item specifics (e.g. `{\"Brand\": [\"Nike\"], \"Color\": [\"Red\"], \"Size\": [\"10\"]}`).",
      optional: true,
    },
    brand: {
      type: "string",
      label: "Brand",
      description: "The brand of the product (e.g. `Nike`).",
      optional: true,
    },
    mpn: {
      type: "string",
      label: "MPN",
      description: "The Manufacturer Part Number (MPN) (e.g. `NK-12345`).",
      optional: true,
    },
    upc: {
      type: "string[]",
      label: "UPC",
      description: "Universal Product Code(s) for the product (e.g. `[\"012345678905\"]` or `012345678905`).",
      optional: true,
    },
    isbn: {
      type: "string[]",
      label: "ISBN",
      description: "International Standard Book Number(s) for the product (e.g. `[\"9780123456789\"]`).",
      optional: true,
    },
    ean: {
      type: "string[]",
      label: "EAN",
      description: "European Article Number(s) for the product (e.g. `[\"4006381333931\"]`).",
      optional: true,
    },
    packageWeight: {
      type: "string",
      label: "Package Weight",
      description: "The weight of the packaged item (e.g. `2.5`).",
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
      description: "The length dimension of the packaged item (e.g. `12`).",
      optional: true,
    },
    packageWidth: {
      type: "string",
      label: "Package Width",
      description: "The width dimension of the packaged item (e.g. `8`).",
      optional: true,
    },
    packageHeight: {
      type: "string",
      label: "Package Height",
      description: "The height dimension of the packaged item (e.g. `4`).",
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
  /**
   * Action run handler that creates or updates an eBay inventory item record.
   * Merges user-provided properties with existing inventory item data to prevent unintentional data loss.
   *
   * @param {object} ctx - Step execution context.
   * @param {object} ctx.$ - Pipedream step execution object.
   * @returns {Promise<object>} The created or updated inventory item response.
   */
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

    const hasLength = packageLength !== undefined && packageLength !== null && packageLength !== "";
    const hasWidth = packageWidth !== undefined && packageWidth !== null && packageWidth !== "";
    const hasHeight = packageHeight !== undefined && packageHeight !== null && packageHeight !== "";
    const dimensionCount = [
      hasLength,
      hasWidth,
      hasHeight,
    ].filter(Boolean).length;

    if (dimensionCount > 0 && dimensionCount < 3) {
      throw new ConfigurationError("If any package dimension (length, width, or height) is provided, all three dimensions must be specified.");
    }
    if (dimensionCount === 3) {
      const l = Number(packageLength);
      const w = Number(packageWidth);
      const h = Number(packageHeight);
      if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
        throw new ConfigurationError("Package dimensions (length, width, height) must be positive numbers.");
      }
    }
    if (packageWeight !== undefined && packageWeight !== null && packageWeight !== "") {
      const weightNum = Number(packageWeight);
      if (isNaN(weightNum) || weightNum <= 0) {
        throw new ConfigurationError("Package weight must be a positive number.");
      }
    }

    let existingItem = null;
    try {
      existingItem = await this.ebay.getInventoryItem({
        $,
        sku,
      });
    } catch (error) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404) {
        existingItem = null;
      } else {
        throw error;
      }
    }

    const existingProduct = existingItem?.product || {};
    const existingAvailability = existingItem?.availability || {};
    const existingPkg = existingItem?.packageWeightAndSize || {};

    const userAspects = formatAspects(aspects) || {};
    if (brand && !userAspects.Brand) {
      userAspects.Brand = [
        brand,
      ];
    }
    const mergedAspects = {
      ...(existingProduct.aspects || {}),
      ...userAspects,
    };

    const parsedImages = imageUrls ? parseArray(imageUrls) : [];
    const finalImages = parsedImages.length > 0
      ? parsedImages
      : existingProduct.imageUrls;

    const parsedUpc = upc ? parseArray(upc) : [];
    const finalUpc = parsedUpc.length > 0
      ? parsedUpc
      : existingProduct.upc;

    const parsedIsbn = isbn ? parseArray(isbn) : [];
    const finalIsbn = parsedIsbn.length > 0
      ? parsedIsbn
      : existingProduct.isbn;

    const parsedEan = ean ? parseArray(ean) : [];
    const finalEan = parsedEan.length > 0
      ? parsedEan
      : existingProduct.ean;

    let dimensions;
    if (hasLength && hasWidth && hasHeight) {
      dimensions = {
        length: Number(packageLength),
        width: Number(packageWidth),
        height: Number(packageHeight),
        unit: dimensionUnit || existingPkg.dimensions?.unit || "INCH",
      };
    } else if (existingPkg.dimensions) {
      dimensions = existingPkg.dimensions;
    }

    let weight;
    if (packageWeight !== undefined && packageWeight !== null && packageWeight !== "") {
      weight = {
        value: Number(packageWeight),
        unit: weightUnit || existingPkg.weight?.unit || "POUND",
      };
    } else if (existingPkg.weight) {
      weight = existingPkg.weight;
    }

    const finalPackageType = packageType || existingPkg.packageType;

    let packageWeightAndSize;
    if (dimensions || weight || finalPackageType) {
      packageWeightAndSize = cleanObject({
        dimensions,
        weight,
        packageType: finalPackageType,
      });
    }

    let finalQuantity;
    if (quantity !== undefined && quantity !== null && quantity !== "") {
      finalQuantity = Number(quantity);
    } else if (existingAvailability?.shipToLocationAvailability?.quantity !== undefined) {
      finalQuantity = existingAvailability.shipToLocationAvailability.quantity;
    } else {
      finalQuantity = 1;
    }

    const availability = {
      ...existingAvailability,
      shipToLocationAvailability: {
        ...(existingAvailability?.shipToLocationAvailability || {}),
        quantity: finalQuantity,
      },
    };

    let finalCondition;
    if (condition !== undefined && condition !== null && condition !== "") {
      finalCondition = condition;
    } else if (existingItem?.condition) {
      finalCondition = existingItem.condition;
    } else {
      finalCondition = "NEW";
    }

    const product = cleanObject({
      ...existingProduct,
      title: title || existingProduct.title,
      description: description || existingProduct.description,
      aspects: Object.keys(mergedAspects).length > 0
        ? mergedAspects
        : undefined,
      imageUrls: finalImages,
      brand: brand || existingProduct.brand,
      mpn: mpn || existingProduct.mpn,
      upc: finalUpc,
      isbn: finalIsbn,
      ean: finalEan,
    });

    const payload = cleanObject({
      availability: Object.keys(availability).length > 0
        ? availability
        : undefined,
      condition: finalCondition,
      conditionDescription: conditionDescription || existingItem?.conditionDescription,
      product,
      packageWeightAndSize,
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
