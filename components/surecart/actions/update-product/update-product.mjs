import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the documentation](https://developer.surecart.com/api-reference/products/update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    productId: {
      propDefinition: [
        surecart,
        "productId",
      ],
    },
    name: {
      propDefinition: [
        surecart,
        "productName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        surecart,
        "productDescription",
      ],
    },
    status: {
      propDefinition: [
        surecart,
        "productStatus",
      ],
    },
    sku: {
      propDefinition: [
        surecart,
        "productSku",
      ],
    },
    slug: {
      propDefinition: [
        surecart,
        "productSlug",
      ],
      description: "A unique, URL-friendly identifier. Example: `premium-plan`",
    },
    recurring: {
      propDefinition: [
        surecart,
        "productRecurring",
      ],
    },
    featured: {
      propDefinition: [
        surecart,
        "productFeatured",
      ],
    },
    taxEnabled: {
      propDefinition: [
        surecart,
        "productTaxEnabled",
      ],
    },
    taxCategory: {
      propDefinition: [
        surecart,
        "productTaxCategory",
      ],
    },
    shippingEnabled: {
      propDefinition: [
        surecart,
        "productShippingEnabled",
      ],
    },
    weight: {
      propDefinition: [
        surecart,
        "productWeight",
      ],
    },
    weightUnit: {
      propDefinition: [
        surecart,
        "productWeightUnit",
      ],
    },
    stockEnabled: {
      propDefinition: [
        surecart,
        "productStockEnabled",
      ],
    },
    stockAdjustment: {
      propDefinition: [
        surecart,
        "productStockAdjustment",
      ],
    },
    allowOutOfStockPurchases: {
      propDefinition: [
        surecart,
        "productAllowOutOfStockPurchases",
      ],
    },
    purchaseLimit: {
      propDefinition: [
        surecart,
        "productPurchaseLimit",
      ],
    },
    reviewsEnabled: {
      propDefinition: [
        surecart,
        "productReviewsEnabled",
      ],
    },
    licensingEnabled: {
      propDefinition: [
        surecart,
        "productLicensingEnabled",
      ],
    },
    licenseActivationLimit: {
      propDefinition: [
        surecart,
        "productLicenseActivationLimit",
      ],
    },
    productGroup: {
      propDefinition: [
        surecart,
        "productProductGroup",
      ],
    },
    shippingProfile: {
      propDefinition: [
        surecart,
        "productShippingProfile",
      ],
    },
    productCollections: {
      propDefinition: [
        surecart,
        "productProductCollections",
      ],
    },
    metadata: {
      propDefinition: [
        surecart,
        "productMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateProduct({
      $,
      productId: this.productId,
      data: {
        product: {
          name: this.name,
          description: this.description,
          status: this.status,
          sku: this.sku,
          slug: this.slug,
          recurring: this.recurring,
          featured: this.featured,
          tax_enabled: this.taxEnabled,
          tax_category: this.taxCategory,
          shipping_enabled: this.shippingEnabled,
          weight: this.weight && Number(this.weight),
          weight_unit: this.weightUnit,
          stock_enabled: this.stockEnabled,
          stock_adjustment: this.stockAdjustment,
          allow_out_of_stock_purchases: this.allowOutOfStockPurchases,
          purchase_limit: this.purchaseLimit,
          reviews_enabled: this.reviewsEnabled,
          licensing_enabled: this.licensingEnabled,
          license_activation_limit: this.licenseActivationLimit,
          product_group: this.productGroup,
          shipping_profile: this.shippingProfile,
          product_collections: this.productCollections,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully updated product ${this.productId}`);
    return response;
  },
};
