import discogs from "../../discogs.app.mjs";

export default {
  key: "discogs-create-marketplace-listing",
  name: "Create Marketplace Listing",
  description: "Creates a new listing in the Discogs marketplace. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-new-listing)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the item (in the seller's currency). **Format 00.00**",
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Any remarks about the item that will be displayed to buyers.",
      optional: true,
    },
    allowOffers: {
      type: "boolean",
      label: "Allow Offers",
      description: "Whether or not to allow buyers to make offers on the item.",
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
      description: "A freeform field that can be used for the seller’s own reference. Information stored here will not be displayed to anyone other than the seller. This field is called “Private Comments” on the Discogs website.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "A freeform field that is intended to help identify an item’s physical storage location. Information stored here will not be displayed to anyone other than the seller. This field will be visible on the inventory management page and will be available in inventory exports via the website.",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "The weight, in grams, of this listing, for the purpose of calculating shipping. Set this field to auto to have the weight automatically estimated for you. **Format 00.00**",
      optional: true,
    },
    formatQuantity: {
      type: "string",
      label: "Format Quantity",
      description: "The number of items this listing counts as, for the purpose of calculating shipping. This field is called \"Counts As\" on the Discogs website. **Format 00.00**",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.discogs.createListing({
      data: {
        release_id: this.releaseId,
        condition: this.condition,
        sleeve_condition: this.sleeveCondition,
        price: this.price && parseFloat(this.price),
        comments: this.comments,
        allow_offers: this.allowOffers,
        status: this.status,
        external_id: this.externalId,
        location: this.location,
        weight: this.weight && parseFloat(this.weight),
        format_quantity: this.formatQuantity,
      },
    });

    $.export("$summary", `Successfully created marketplace listing for release ID: ${this.releaseId}`);
    return response;
  },
};
