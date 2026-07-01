import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-create-fulfillment-update-request",
  name: "Create Fulfillment Update Request",
  description:
    "Creates a new fulfillment update request for a specific fulfillment."
    + " The fulfillment must be in `in_fulfillment` state."
    + " Use this to modify items, quantities, prices, addresses, or priority on an active fulfillment."
    + " `fulfillment_items` must include at least one item with a valid SKU; `price_set` quantities must sum to the item quantity."
    + " Address fields `first_name`/`last_name` or `company` are conditionally required (at least one set must be present)."
    + " [See the documentation](https://api.everstox.com/api/v1/ui/#/Fulfillment-updates/district_core.api.shops.fulfillments.fulfillments.Fulfillments.create_fulfillment_update_request)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    everstox,
    fulfillmentId: {
      type: "string",
      label: "Fulfillment ID",
      description: "The UUID of the fulfillment to update, for example 550e8400-e29b-41d4-a716-446655440000. Obtain this from the fulfillment object you want to modify. Must be in in_fulfillment state.",
    },
    fulfillmentItems: {
      type: "string",
      label: "Fulfillment Items",
      description: "JSON array of fulfillment items to update. Must contain at least one item."
        + " Omit `id` when adding a new item; include it when updating an existing one."
        + " Each item requires a `product.sku` and a `price_set` with at least one entry."
        + " Example: `[{\"id\": \"550e8400-e29b-41d4-a716-446655440000\", \"quantity\": 2, \"product\": {\"sku\": \"PROD-001\"}, \"price_set\": [{\"quantity\": 2, \"currency\": \"EUR\", \"price_net_after_discount\": \"19.99\", \"tax_amount\": \"3.80\", \"tax_rate\": \"0.19\"}]}]`",
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address",
      description: "JSON object with the complete shipping address."
        + " Required fields: `country_code` (ISO 2-letter, e.g. `\"DE\"`), `country` (full country name, e.g. `\"Germany\"`), `city`, `zip`, `address_1`,"
        + " and at least one of `first_name`/`last_name` or `company`."
        + " Optional: `address_2`, `title`, `phone`, `province_code`, `address_type` (`private` or `business`)."
        + " Example: `{\"first_name\": \"John\", \"last_name\": \"Doe\", \"country_code\": \"DE\", \"country\": \"Germany\", \"city\": \"Berlin\", \"zip\": \"10115\", \"address_1\": \"Musterstra\\u00dfe 1\", \"address_type\": \"private\"}`",
      optional: true,
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      description: "JSON object with the complete billing address."
        + " Required fields: `country_code` (ISO 2-letter, e.g. `\"DE\"`), `country` (full country name, e.g. `\"Germany\"`), `city`, `zip`, `address_1`,"
        + " and at least one of `first_name`/`last_name` or `company`."
        + " Optional: `address_2`, `title`, `phone`, `VAT_number`, `address_type` (`private` or `business`)."
        + " Example: `{\"first_name\": \"John\", \"last_name\": \"Doe\", \"country_code\": \"DE\", \"country\": \"Germany\", \"city\": \"Berlin\", \"zip\": \"10115\", \"address_1\": \"Musterstra\\u00dfe 1\", \"address_type\": \"private\"}`",
      optional: true,
    },
    fulfillmentPriority: {
      type: "integer",
      label: "Fulfillment Priority",
      description: "Priority level for the fulfillment. Must be between 1 (highest) and 99 (lowest).",
      optional: true,
      min: 1,
      max: 99,
    },
  },
  async run({ $ }) {
    const fulfillmentItems = this.fulfillmentItems
      ? JSON.parse(this.fulfillmentItems)
      : undefined;
    const shippingAddress = this.shippingAddress
      ? JSON.parse(this.shippingAddress)
      : undefined;
    const billingAddress = this.billingAddress
      ? JSON.parse(this.billingAddress)
      : undefined;

    const response = await this.everstox.createFulfillmentUpdateRequest({
      $,
      fulfillmentId: this.fulfillmentId,
      data: {
        fulfillment_items: fulfillmentItems,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        fulfillment_priority: this.fulfillmentPriority,
      },
    });

    $.export("$summary", `Successfully created fulfillment update request for fulfillment \`${this.fulfillmentId}\``);

    return response;
  },
};
