import domainGroup from "../../domain_group.app.mjs";
import { BUSINESS_TYPES } from "../../common/property-types.mjs";

export default {
  key: "domain_group-create-business-listing",
  name: "Create Business Listing",
  description: "Creates a new business listing. [See the documentation](https://developer.domain.com.au/docs/latest/apis/pkg_listing_management/references/listings_upsertbusinesslisting/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    domainGroup,
    agencyId: {
      propDefinition: [
        domainGroup,
        "agencyId",
      ],
    },
    providerAdId: {
      propDefinition: [
        domainGroup,
        "providerAdId",
      ],
    },
    propertyType: {
      propDefinition: [
        domainGroup,
        "propertyType",
      ],
      options: BUSINESS_TYPES,
    },
    listingAction: {
      propDefinition: [
        domainGroup,
        "listingAction",
      ],
    },
    underOfferOrContract: {
      propDefinition: [
        domainGroup,
        "underOfferOrContract",
      ],
    },
    nabers: {
      propDefinition: [
        domainGroup,
        "nabers",
      ],
    },
    fromPrice: {
      propDefinition: [
        domainGroup,
        "fromPrice",
      ],
    },
    toPrice: {
      propDefinition: [
        domainGroup,
        "toPrice",
      ],
    },
    description: {
      propDefinition: [
        domainGroup,
        "description",
      ],
    },
    features: {
      propDefinition: [
        domainGroup,
        "features",
      ],
    },
    streetNumber: {
      propDefinition: [
        domainGroup,
        "streetNumber",
      ],
    },
    unitNumber: {
      propDefinition: [
        domainGroup,
        "unitNumber",
      ],
    },
    street: {
      propDefinition: [
        domainGroup,
        "street",
      ],
    },
    state: {
      propDefinition: [
        domainGroup,
        "state",
      ],
    },
    suburb: {
      propDefinition: [
        domainGroup,
        "suburb",
      ],
    },
    postcode: {
      propDefinition: [
        domainGroup,
        "postcode",
      ],
    },
    receiveEmailsToDefaultAddress: {
      propDefinition: [
        domainGroup,
        "receiveEmailsToDefaultAddress",
      ],
    },
    isRural: {
      propDefinition: [
        domainGroup,
        "isRural",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.domainGroup.createBusinessListing({
      $,
      data: {
        domainAgencyID: this.agencyId,
        providerAdId: this.providerAdId,
        listingAction: this.listingAction,
        underOfferOrContract: this.underOfferOrContract,
        nabers: this.nabers && +this.nabers,
        price: {
          from: this.fromPrice,
          to: this.toPrice,
        },
        description: this.description,
        features: this.features,
        propertyDetails: {
          propertyType: [
            this.propertyType,
          ],
          address: {
            streetNumber: this.streetNumber,
            unitNumber: this.unitNumber,
            street: this.street,
            state: this.state,
            suburb: this.suburb,
            postcode: this.postcode,
          },
        },
        receiveEmailsToDefaultAddress: this.receiveEmailsToDefaultAddress,
        isRural: this.isRural,
      },
    });
    $.export("$summary", `Created business listing with ID: ${response.id}`);
    return response;
  },
};
