import constants from "../../common/constants.mjs";
import app from "../../etsy.app.mjs";

export default {
  key: "etsy-create-draft-listing-product",
  name: "Create Draft Listing Product",
  description: "Creates a physical draft listing product in a shop on the Etsy channel. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/createDraftListing)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The positive non-zero number of products available for purchase in the listing. Note: The listing quantity is the sum of available offering quantities.",
      default: 1,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The listing's title string. When creating or updating a listing, valid title strings contain only letters, numbers, punctuation marks, mathematical symbols, whitespace characters, `™`, `©`, and `®`. (regex: `/[^\\p{L}\\p{Nd}\\p{P}\\p{Sm}\\p{Zs}™©®]/u`) You can only use the `%`, `:`, `&` and `+` characters once each.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description string of the product for sale in the listing.",
    },
    price: {
      type: "string",
      label: "Price",
      description: "The positive non-zero price of the product. (Sold product listings are private) Note: The price is the minimum possible price.",
    },
    whoMade: {
      type: "string",
      label: "Who Made",
      description: "An enumerated string indicating who made the product. Helps buyers locate the listing under the Handmade heading. Requires **Is Supply** and **Who Made** properties.",
      options: constants.WHO_MADE_OPTIONS,
    },
    whenMade: {
      type: "string",
      label: "When Made",
      description: "An enumerated string for the era in which the maker made the product in this listing. Helps buyers locate the listing under the Vintage heading. Requires **Is Supply** and **Who Made** properties.",
      options: constants.WHEN_MADE_OPTIONS,
    },
    taxonomyType: {
      propDefinition: [
        app,
        "taxonomyType",
      ],
    },
    taxonomyId: {
      propDefinition: [
        app,
        "taxonomyId",
        ({ taxonomyType }) => ({
          taxonomyType,
        }),
      ],
    },
    isSupply: {
      type: "boolean",
      label: "Is Supply",
      description: "When true, tags the listing as a supply product, else indicates that it's a finished product. Helps buyers locate the listing under the Supplies heading. Requires **Who Made** and **When Made**.",
    },
    listingType: {
      reloadProps: true,
      propDefinition: [
        app,
        "listingType",
      ],
    },
  },
  async additionalProps() {
    const hasPhysicalType = [
      constants.LISTING_TYPE.PHYSICAL,
      constants.LISTING_TYPE.BOTH,
    ].includes(this.listingType);

    if (!hasPhysicalType) {
      return {};
    }

    const { shop_id: shopId } = await this.app.getMe();
    const { results } = await this.app.getShopShippingProfiles({
      shopId,
    });

    return {
      shippingProfileId: {
        type: "string",
        label: "Shipping Profile",
        description: "The numeric ID of the shipping profile associated with the listing. Required when listing type is `physical`.",
        options: results?.map(({
          shipping_profile_id: value,
          title: label,
        }) => ({
          value,
          label,
        })),
      },
    };
  },
  methods: {
    createDraftListing({
      shopId, ... args
    } = {}) {
      return this.app.post({
        path: `/application/shops/${shopId}/listings`,
        ... args,
      });
    },
  },
  async run({ $: step }) {
    const {
      quantity,
      title,
      description,
      price,
      whoMade,
      whenMade,
      taxonomyId,
      isSupply,
      listingType,
      shippingProfileId,
    } = this;

    const { shop_id: shopId } = await this.app.getMe();

    const response = await this.createDraftListing({
      step,
      shopId,
      data: {
        quantity,
        title,
        description,
        price,
        who_made: whoMade,
        when_made: whenMade,
        taxonomy_id: taxonomyId,
        is_supply: isSupply,
        type: listingType,
        shipping_profile_id: shippingProfileId,
      },
    });

    step.export("$summary", `Successfully created draft listing product with ID ${response.listing_id}.`);

    return response;
  },
};
