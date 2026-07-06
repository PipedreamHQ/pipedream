import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-variant",
  name: "Create Variant",
  description: "Create a new variant. [See the documentation](https://developer.surecart.com/api-reference/variants/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    product: {
      type: "string",
      label: "Product ID",
      description: "The UUID of the product this variant belongs to. Use **List Products** to find product IDs.",
    },
    option1: {
      type: "string",
      label: "Option 1",
      description: "The value for the first variant option. Example: `Red`",
    },
    option2: {
      type: "string",
      label: "Option 2",
      description: "The value for the second variant option.",
      optional: true,
    },
    option3: {
      type: "string",
      label: "Option 3",
      description: "The value for the third variant option.",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount in cents to charge for this variant. If empty, the regular price amount is used. Example: `1999`",
      optional: true,
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Stock keeping unit for this variant.",
      optional: true,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "Ordering position when displayed to customers.",
      optional: true,
    },
    purchaseLimit: {
      type: "integer",
      label: "Purchase Limit",
      description: "Max times this variant can be purchased by a customer.",
      min: 1,
      optional: true,
    },
    stockEnabled: {
      type: "boolean",
      label: "Stock Enabled",
      description: "Set to `true` to track stock for this variant.",
      optional: true,
    },
    stockAdjustment: {
      type: "integer",
      label: "Stock Adjustment",
      description: "Amount to adjust the stock by (positive or negative).",
      optional: true,
    },
    shippingEnabled: {
      type: "boolean",
      label: "Shipping Enabled",
      description: "Set to `true` to require a shipping address at checkout.",
      optional: true,
    },
    taxEnabled: {
      type: "boolean",
      label: "Tax Enabled",
      description: "Set to `true` to make this variant taxable.",
      optional: true,
    },
    taxCategory: {
      type: "string",
      label: "Tax Category",
      description: "The tax category for this variant.",
      optional: true,
    },
    allowOutOfStockPurchases: {
      type: "boolean",
      label: "Allow Out Of Stock Purchases",
      description: "Set to `true` to allow purchases when stock runs out.",
      optional: true,
    },
    autoFulfillEnabled: {
      type: "boolean",
      label: "Auto Fulfill Enabled",
      description: "Set to `true` to auto-fulfill this variant on purchase.",
      optional: true,
    },
    downloadsEnabled: {
      type: "boolean",
      label: "Downloads Enabled",
      description: "Set to `true` to enable downloads for this variant.",
      optional: true,
    },
    licenseActivationLimit: {
      type: "integer",
      label: "License Activation Limit",
      description: "Max activations allowed per license.",
      min: 1,
      optional: true,
    },
    image: {
      type: "string",
      label: "Image ID",
      description: "The UUID of the media image for this variant.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createVariant({
      $,
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
    $.export("$summary", `Successfully created variant ${response.id}`);
    return response;
  },
};
