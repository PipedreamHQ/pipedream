import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-line-item",
  name: "Create Line Item",
  description: "Add a line item to a checkout. [See the documentation](https://developer.surecart.com/api-reference/line-items/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    price: {
      type: "string",
      label: "Price ID",
      description: "UUID of the price to add. Example: `price_abc123`",
    },
    checkout: {
      propDefinition: [
        surecart,
        "checkoutId",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Number of units to add. Example: `2`",
      optional: true,
    },
    adHocAmount: {
      type: "integer",
      label: "Ad Hoc Amount",
      description: "Custom price amount in cents when the price has `ad_hoc` enabled. Example: `5000` for $50.00",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note for this line item. Example: `Gift wrapping requested`",
      optional: true,
    },
    bump: {
      type: "string",
      label: "Bump ID",
      description: "UUID of an order bump associated with this line item. Example: `bump_abc123`",
      optional: true,
    },
    upsell: {
      type: "string",
      label: "Upsell ID",
      description: "UUID of an upsell associated with this line item. Example: `upsell_abc123`",
      optional: true,
    },
    variant: {
      type: "string",
      label: "Variant ID",
      description: "UUID of the product variant to use. Example: `var_abc123`",
      optional: true,
    },
    bundleComponentVariants: {
      type: "object",
      label: "Bundle Component Variants",
      description: "Map of bundle component UUIDs to selected variant UUIDs. Example: `{ \"component_abc\": \"variant_xyz\" }`",
      optional: true,
    },
    consolidate: {
      type: "boolean",
      label: "Consolidate",
      description: "If `true`, merge with an existing line item for the same price rather than creating a new one.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createLineItem({
      $,
      params: {
        consolidate: this.consolidate,
      },
      data: {
        line_item: {
          price: this.price,
          checkout: this.checkout,
          quantity: this.quantity,
          ad_hoc_amount: this.adHocAmount,
          note: this.note,
          bump: this.bump,
          upsell: this.upsell,
          variant: this.variant,
          bundle_component_variants: this.bundleComponentVariants,
        },
      },
    });
    $.export("$summary", `Successfully created line item ${response.id}`);
    return response;
  },
};
