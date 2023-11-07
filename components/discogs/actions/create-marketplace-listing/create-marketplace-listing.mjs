import discogs from "../../discogs.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "discogs-create-marketplace-listing",
  name: "Create Marketplace Listing",
  description: "Creates a new listing in the Discogs marketplace. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-new-listing)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    discogs,
    releaseId: {
      type: "integer",
      label: "Release ID",
      description: "The ID of the release you are listing for sale.",
    },
    condition: {
      propDefinition: [
        discogs,
        "listingCondition",
      ],
    },
    sleeveCondition: {
      propDefinition: [
        discogs,
        "sleeveCondition",
      ],
    },
    price: {
      type: "number",
      label: "Price",
      description: "The price of the item.",
      min: 0,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Any comments about the listing.",
      optional: true,
    },
    allowOffers: {
      type: "boolean",
      label: "Allow Offers",
      description: "Whether to allow offers on this listing.",
      default: false,
    },
    status: {
      propDefinition: [
        discogs,
        "listingStatus",
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "An external ID that you can use to reference the listing.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the item.",
      optional: true,
    },
    weight: {
      type: "integer",
      label: "Weight",
      description: "The weight of the item in grams.",
      optional: true,
    },
    formatQuantity: {
      type: "integer",
      label: "Format Quantity",
      description: "The quantity of the format you are selling. For example, if you are selling a 2xLP, you would enter 2.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.discogs.createListing({
      releaseId: this.releaseId,
      condition: this.condition,
      sleeveCondition: this.sleeveCondition,
      price: this.price,
      comments: this.comments,
      allowOffers: this.allowOffers,
      status: this.status,
      externalId: this.externalId,
      location: this.location,
      weight: this.weight,
      formatQuantity: this.formatQuantity,
    });

    $.export("$summary", `Successfully created marketplace listing for release ID ${this.releaseId}`);
    return response;
  },
};
