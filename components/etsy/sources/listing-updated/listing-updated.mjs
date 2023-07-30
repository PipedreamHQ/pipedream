import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "etsy-listing-updated",
  name: "Listing Updated",
  description: "Emit new event when a listing is updated. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/getListingsByShop)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    state: {
      propDefinition: [
        common.props.app,
        "state",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getListingsByShop;
    },
    getResourceFnArgs(shopId) {
      return {
        shopId,
        params: {
          limit: constants.DEFAULT_LIMIT,
          sort_on: "updated",
          sort_order: "desc",
          state: this.state,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: `${resource.listing_id}-${resource.updated_timestamp}`,
        summary: `Updated Listing: ${resource.listing_id}`,
        ts: resource.updated_timestamp,
      };
    },
  },
};
