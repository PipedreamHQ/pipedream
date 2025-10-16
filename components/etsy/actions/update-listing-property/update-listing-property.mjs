import propertyValues from "../../common/property-values.mjs";
import app from "../../etsy.app.mjs";

export default {
  key: "etsy-update-listing-property",
  name: "Update Listing Property",
  description: "Updates or populates the properties list defining product offerings for a listing. Each offering requires both a `value` and a `value_id` that are valid for a `scale_id` assigned to the listing or that you assign to the listing with this request. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/updateListingProperty)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    shopId: {
      optional: true,
      propDefinition: [
        app,
        "shopId",
      ],
    },
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
    },
    propertyId: {
      propDefinition: [
        app,
        "propertyId",
        ({ listingId }) => ({
          listingId,
        }),
      ],
    },
    valueId: {
      type: "integer",
      label: "Value",
      description: "The value of the property. If you don't get a list of values you can also set a structure like this `{{{\"value\": 1, \"label\": \"Black\"}}}` as an example using the **Enter a custom expression** tab.",
      withLabel: true,
      options() {
        return propertyValues[this.propertyId] || [];
      },
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
    const {
      listingId, propertyId, valueId,
    } = this;

    const { shop_id: shopId } = await this.app.getMe();

    const response = await this.updateListingProperty({
      step,
      shopId,
      listingId,
      propertyId,
      data: {
        value_ids: [
          valueId?.value,
        ],
        values: [
          valueId?.label,
        ],
      },
    });

    step.export("$summary", `Successfully updated listing property with ID ${response.property_id}.`);

    return response;
  },
};
