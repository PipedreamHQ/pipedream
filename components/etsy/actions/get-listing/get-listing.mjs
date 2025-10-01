import app from "../../etsy.app.mjs";

export default {
  key: "etsy-get-listing",
  name: "Get Listing",
  description: "Retrieves a listing record by listing ID. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/getListing)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  methods: {
    getListing({
      listingId, ...args
    }) {
      return this.app.makeRequest({
        path: `/application/listings/${listingId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getListing({
      step,
      listingId: this.listingId,
    });

    step.export("$summary", `Successfully retrieved listing with ID ${response.listing_id}.`);

    return response;
  },
};
