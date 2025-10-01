import utils from "../../common/utils.mjs";
import app from "../../etsy.app.mjs";

export default {
  key: "etsy-update-listing-inventory",
  name: "Update Listing Inventory",
  description: "Updates the inventory for a listing identified by a listing ID. [See the Documentation](https://developer.etsy.com/documentation/reference/#operation/getListingInventory)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    listingId: {
      propDefinition: [
        app,
        "listingId",
        ({
          shopId, state,
        }) => ({
          shopId,
          state,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.listingId) {
      const listing = await this.app.getListingInventory({
        listingId: this.listingId,
      });
      props.products = {
        type: "string[]",
        label: "Products",
        description: "A list of products available in a listing, All field names in the object are lowercase. E.g. {\"sku\": \"string\",\"property_values\": [],\"offerings\": [{\"price\": 0,\"quantity\": 0,\"is_enabled\": true}]}",
        default: listing.products.map((item) => {
          delete item.product_id;
          delete item.is_deleted;
          item.offerings = item.offerings.map((offering) => {
            delete offering.offering_id,
            delete offering.is_deleted;
            offering.price = offering.price.amount;
            return offering;
          });
          return JSON.stringify(item);

        }),
        optional: true,
      };
      props.priceOnProperty = {
        type: "string[]",
        label: "Price On Property",
        description: "A list of unique listing property ID integers for the properties that change product prices, if any. For example, if you charge specific prices for different sized products in the same listing, then this array contains the property ID for size.",
        default: listing.price_on_property,
        optional: true,
      };
      props.quantityOnProperty = {
        type: "string[]",
        label: "Quantity On Property",
        description: "A list of unique listing property ID integers for the properties that change the quantity of the products, if any. For example, if you stock specific quantities of different colored products in the same listing, then this array contains the property ID for color.",
        default: listing.quantity_on_property,
        optional: true,
      };
      props.skuOnProperty = {
        type: "string[]",
        label: "SKU On Property",
        description: "A list of unique listing property ID integers for the properties that change the product SKU, if any. For example, if you use specific skus for different colored products in the same listing, then this array contains the property ID for color.",
        default: listing.sku_on_property,
        optional: true,
      };
    }
    return props;
  },
  methods: {
    updateListingInventory({
      listingId, ...args
    }) {
      return this.app.put({
        path: `/application/listings/${listingId}/inventory`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.updateListingInventory({
      step,
      listingId: this.listingId,
      data: {
        products: this.products && utils.parseObject(this.products),
        price_on_property: this.priceOnProperty,
        quantity_on_property: this.quantityOnProperty,
        sku_on_property: this.skuOnProperty,
      },
    });

    step.export("$summary", `Successfully updated listing inventory with ID ${this.listingId}.`);

    return response;
  },
};
