import app from "../../etsy.app.mjs";

export default {
  key: "etsy-update-listing-property",
  name: "Update Listing Property",
  description: "Updates or populates the properties list defining product offerings for a listing. Each offering requires both a `value` and a `value_id` that are valid for a `scale_id` assigned to the listing or that you assign to the listing with this request. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/updateListingProperty)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    listingId: {
      propDefinition: [
        app,
        "listingId",
      ],
    },
    propertyId: {
      propDefinition: [
        app,
        "propertyId",
        ({ listingId }) => ({ listingId }),
      ],
    },
    valueIds: {
      propDefinition: [
        app,
        "valueIds",
        ({ listingId, propertyId }) => ({ listingId, propertyId }),
      ],
    },
    values: {
      propDefinition: [
        app,
        "values",
        ({ listingId, propertyId }) => ({ listingId, propertyId }),
      ],
    },
  },
  methods: {
    updateListingProperty({
      shopId, listingId, propertyId, ...args
    }) {
      return this.app.put({
        path: `/application/shops/${shopId}/listings/${listingId}/properties/${propertyId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { listingId, propertyId, valueIds, values } = this;

    const { shop_id: shopId } = await this.getMe();

    const response = await this.updateListingProperty({
      step,
      shopId,
      listingId,
      propertyId,
      params: {
        value_ids: valueIds,
        values,
      },
    });

    step.export("$summary", `Successfully updated listing property with ID ${response.property_id}.`);

    return response;
  },
};
