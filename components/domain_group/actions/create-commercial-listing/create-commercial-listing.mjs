import domainGroup from "../../domain_group.app.mjs";
import { COMMERCIAL_TYPES } from "../../common/property-types.mjs";

export default {
  key: "domain_group-create-commercial-listing",
  name: "Create Commercial Listing",
  description: "Creates a new commercial listing. [See the documentation](https://developer.domain.com.au/docs/latest/apis/pkg_listing_management/references/listings_upsertcommerciallisting/).",
  version: "0.0.3",
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
      options: COMMERCIAL_TYPES,
    },
    listingAction: {
      propDefinition: [
        domainGroup,
        "listingAction",
      ],
      reloadProps: true,
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
    areaValue: {
      type: "string",
      label: "Area Value",
      description: "The size of the area in the commercial listing",
    },
    areaUnit: {
      type: "string",
      label: "Area Unit",
      description: "The unit of measure of the area value",
      options: [
        "squareMetres",
        "acres",
        "hectares",
        "squareFeet",
        "squareYards",
        "squares",
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
    occupancyType: {
      type: "string",
      label: "Occupancy Type",
      description: "The occupancy type of the listing",
      options: [
        "tenanted",
        "vacant",
      ],
      optional: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.listingAction) {
      return props;
    }

    const saleFromPrice = {
      type: "integer",
      label: "Sale - From Price",
      description: "Lowest price the property is expected to sell for to set search price. For a fixed price, set this value the same as To Price",
    };
    const saleToPrice = {
      type: "integer",
      label: "Sale - To Price",
      description: "Highest price the property is expected to sell for to set search price. For a fixed price, set this value the same as From Price",
    };
    const leaseFromPrice = {
      type: "integer",
      label: "Lease - From Price",
      description: "Lowest price the property is expected to rent for to set search price. For a fixed price, set this value the same as To Price",
    };
    const leaseToPrice = {
      type: "integer",
      label: "Lease - To Price",
      description: "Highest price the property is expected to rent for to set search price. For a fixed price, set this value the same as From Price",
    };

    if (this.listingAction === "sale") {
      props.saleFromPrice = saleFromPrice;
      props.saleToPrice = saleToPrice;
    }
    if (this.listingAction === "rent") {
      props.leaseFromPrice = leaseFromPrice;
      props.leaseToPrice = leaseToPrice;
    }
    if (this.listingAction === "saleAndLease") {
      props.saleFromPrice = saleFromPrice;
      props.saleToPrice = saleToPrice;
      props.leaseFromPrice = leaseFromPrice;
      props.leaseToPrice = leaseToPrice;
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.domainGroup.createCommercialListing({
      $,
      data: {
        domainAgencyID: this.agencyId,
        providerAdId: this.providerAdId,
        nabers: this.nabers,
        listingAction: this.listingAction,
        underOfferOrContract: this.underOfferOrContract,
        salePrice: this.saleFromPrice
          ? {
            from: this.saleFromPrice,
            to: this.saleToPrice,
          }
          : undefined,
        leasePrice: this.leaseFromPrice
          ? {
            from: this.leaseFromPrice,
            to: this.leaseToPrice,
          }
          : undefined,
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
          area: {
            value: +this.areaValue,
            unit: this.areaUnit,
          },
        },
        receiveEmailsToDefaultAddress: this.receiveEmailsToDefaultAddress,
        isRural: this.isRural,
        occupancyType: this.occupancyType,
      },
    });
    $.export("$summary", `Created commercial listing with ID: ${response.id}`);
    return response;
  },
};
