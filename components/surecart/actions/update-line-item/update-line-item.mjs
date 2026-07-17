import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-line-item",
  name: "Update Line Item",
  description: "Update an existing line item. [See the documentation](https://developer.surecart.com/api-reference/line-items/update)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    lineItemId: {
      propDefinition: [
        surecart,
        "lineItemId",
      ],
    },
    consolidate: {
      type: "boolean",
      label: "Consolidate",
      description: "Set to `true` to merge this line item into an existing line item for the same price on the same checkout.",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Number of units being purchased. Example: `2`",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price ID",
      description: "UUID of the price to assign to this line item. Use **List Prices** to find price IDs. Example: `price_abc123`",
      optional: true,
    },
    checkout: {
      propDefinition: [
        surecart,
        "checkoutId",
      ],
    },
    adHocAmount: {
      type: "integer",
      label: "Ad Hoc Amount",
      description: "Custom amount in cents for this line item when the associated price has `ad_hoc=true`. Example: `5000` for $50.00",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Custom note for this line item, e.g. special instructions or context. Example: `Gift wrap requested`",
      optional: true,
    },
    bump: {
      type: "string",
      label: "Bump ID",
      description: "UUID of the order bump to associate with this line item. Example: `bump_abc123`",
      optional: true,
    },
    upsell: {
      type: "string",
      label: "Upsell ID",
      description: "UUID of the upsell to associate with this line item. Example: `upsell_abc123`",
      optional: true,
    },
    variant: {
      type: "string",
      label: "Variant ID",
      description: "UUID of the product variant. Example: `var_abc123`",
      optional: true,
    },
    bundleComponentVariants: {
      type: "object",
      label: "Bundle Component Variants",
      description: "Map of bundle component product UUIDs to selected variant UUIDs. Example: `{ \"prod_abc123\": \"var_def456\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateLineItem({
      $,
      lineItemId: this.lineItemId,
      params: {
        consolidate: this.consolidate,
      },
      data: {
        line_item: {
          quantity: this.quantity,
          price: this.price,
          checkout: this.checkout,
          ad_hoc_amount: this.adHocAmount,
          note: this.note,
          bump: this.bump,
          upsell: this.upsell,
          variant: this.variant,
          bundle_component_variants: this.bundleComponentVariants,
        },
      },
    });
    $.export("$summary", `Successfully updated line item ${this.lineItemId}`);
    return response;
  },
};
