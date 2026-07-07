import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-variant",
  name: "Update Variant",
  description: "Update an existing variant. [See the documentation](https://developer.surecart.com/api-reference/variants/update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    variantId: {
      propDefinition: [
        surecart,
        "variantId",
      ],
    },
    product: {
      propDefinition: [
        surecart,
        "variantProduct",
      ],
      optional: true,
    },
    option1: {
      propDefinition: [
        surecart,
        "variantOption1",
      ],
      optional: true,
    },
    option2: {
      propDefinition: [
        surecart,
        "variantOption2",
      ],
    },
    option3: {
      propDefinition: [
        surecart,
        "variantOption3",
      ],
    },
    amount: {
      propDefinition: [
        surecart,
        "variantAmount",
      ],
    },
    sku: {
      propDefinition: [
        surecart,
        "variantSku",
      ],
    },
    position: {
      propDefinition: [
        surecart,
        "variantPosition",
      ],
    },
    purchaseLimit: {
      propDefinition: [
        surecart,
        "variantPurchaseLimit",
      ],
    },
    stockEnabled: {
      propDefinition: [
        surecart,
        "variantStockEnabled",
      ],
    },
    stockAdjustment: {
      propDefinition: [
        surecart,
        "variantStockAdjustment",
      ],
    },
    shippingEnabled: {
      propDefinition: [
        surecart,
        "variantShippingEnabled",
      ],
    },
    taxEnabled: {
      propDefinition: [
        surecart,
        "variantTaxEnabled",
      ],
    },
    taxCategory: {
      propDefinition: [
        surecart,
        "variantTaxCategory",
      ],
    },
    allowOutOfStockPurchases: {
      propDefinition: [
        surecart,
        "variantAllowOutOfStockPurchases",
      ],
    },
    autoFulfillEnabled: {
      propDefinition: [
        surecart,
        "variantAutoFulfillEnabled",
      ],
    },
    downloadsEnabled: {
      propDefinition: [
        surecart,
        "variantDownloadsEnabled",
      ],
    },
    licenseActivationLimit: {
      propDefinition: [
        surecart,
        "variantLicenseActivationLimit",
      ],
    },
    image: {
      propDefinition: [
        surecart,
        "variantImage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateVariant({
      $,
      variantId: this.variantId,
      data: {
        variant: {
          product: this.product,
          option_1: this.option1,
          option_2: this.option2,
          option_3: this.option3,
          amount: this.amount,
          sku: this.sku,
          position: this.position,
          purchase_limit: this.purchaseLimit,
          stock_enabled: this.stockEnabled,
          stock_adjustment: this.stockAdjustment,
          shipping_enabled: this.shippingEnabled,
          tax_enabled: this.taxEnabled,
          tax_category: this.taxCategory,
          allow_out_of_stock_purchases: this.allowOutOfStockPurchases,
          auto_fulfill_enabled: this.autoFulfillEnabled,
          downloads_enabled: this.downloadsEnabled,
          license_activation_limit: this.licenseActivationLimit,
          image: this.image,
        },
      },
    });
    $.export("$summary", `Successfully updated variant ${this.variantId}`);
    return response;
  },
};
