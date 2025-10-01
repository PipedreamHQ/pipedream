import melo from "../../melo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "melo-search-properties",
  name: "Search Properties",
  description: "Searches properties in Melo. [See the documentation](https://docs.melo.io/api-reference/endpoint/properties/get_collection)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    melo,
    bedroomMax: {
      type: "integer",
      label: "Maximum Bedrooms",
      description: "Maximum number of bedrooms in the property.",
      optional: true,
    },
    bedroomMin: {
      type: "integer",
      label: "Minimum Bedrooms",
      description: "Minimum number of bedrooms in the property.",
      optional: true,
    },
    budgetMax: {
      type: "integer",
      label: "Maximum Budget",
      description: "Maximum budget for the property.",
      optional: true,
    },
    budgetMin: {
      type: "integer",
      label: "Minimum Budget",
      description: "Minimum budget for the property.",
      optional: true,
    },
    condominiumFeesMax: {
      type: "integer",
      label: "Maximum Condominium Fees",
      description: "Maximum condominium fees for the property.",
      optional: true,
    },
    condominiumFeesMin: {
      type: "integer",
      label: "Minimum Condominium Fees",
      description: "Minimum condominium fees for the property.",
      optional: true,
    },
    constructionYearMax: {
      type: "integer",
      label: "Maximum Construction Year",
      description: "Maximum construction year of the property.",
      optional: true,
    },
    constructionYearMin: {
      type: "integer",
      label: "Minimum Construction Year",
      description: "Minimum construction year of the property.",
      optional: true,
    },
    energyCategories: {
      type: "string[]",
      label: "Energy Efficiency Categories",
      description: "The energy efficiency categories of the property.",
      optional: true,
    },
    energyValueMax: {
      type: "integer",
      label: "Maximum Energy Value",
      description: "Maximum energy value of the property.",
      optional: true,
    },
    energyValueMin: {
      type: "integer",
      label: "Minimum Energy Value",
      description: "Minimum energy value of the property.",
      optional: true,
    },
    eventPriceVariationFromCreatedAt: {
      type: "string",
      label: "Event Price Variation From Created At",
      description: "Date from which an event of type price is created — inclusive.",
      optional: true,
    },
    eventPriceVariationMax: {
      type: "integer",
      label: "Maximum Event Price Variation",
      description: "Maximum percent variation of an event of type price.",
      optional: true,
    },
    eventPriceVariationMin: {
      type: "integer",
      label: "Minimum Event Price Variation",
      description: "Minimum percent variation of an event of type price.",
      optional: true,
    },
    eventPriceVariationToCreatedAt: {
      type: "string",
      label: "Event Price Variation To Created At",
      description: "Date before which an event of type price is created — inclusive.",
      optional: true,
    },
    eventSurfaceVariationFromCreatedAt: {
      type: "string",
      label: "Event Surface Variation From Created At",
      description: "Date from which an event of type surface is created — inclusive.",
      optional: true,
    },
    eventSurfaceVariationMax: {
      type: "integer",
      label: "Maximum Event Surface Variation",
      description: "Maximum percent variation of an event of type surface.",
      optional: true,
    },
    eventSurfaceVariationMin: {
      type: "integer",
      label: "Minimum Event Surface Variation",
      description: "Minimum percent variation of an event of type surface.",
      optional: true,
    },
    eventSurfaceVariationToCreatedAt: {
      type: "string",
      label: "Event Surface Variation To Created At",
      description: "Date before which an event of type surface is created — inclusive.",
      optional: true,
    },
    excludedCities: {
      type: "string[]",
      label: "Excluded Cities",
      description: "Cities to be excluded.",
      optional: true,
    },
    excludedInseeCodes: {
      type: "string[]",
      label: "Excluded Insee Codes",
      description: "Insee codes to be excluded.",
      optional: true,
    },
    excludedProperties: {
      type: "string[]",
      label: "Excluded Properties",
      description: "Properties to be excluded.",
      optional: true,
    },
    excludedZipcodes: {
      type: "string[]",
      label: "Excluded Zipcodes",
      description: "Zipcodes to be excluded.",
      optional: true,
    },
    expired: {
      type: "boolean",
      label: "Expired",
      description: "Whether to show properties that are expired. A property is considered expired when all its adverts are expired. Can be `true`, `false` or `null`. Default is `null` which returns all properties no matter if they’re expired or not.",
      optional: true,
    },
    feesPercentageMax: {
      type: "integer",
      label: "Maximum Fees Percentage",
      description: "Maximum percentage of fees.",
      optional: true,
    },
    feesPercentageMin: {
      type: "integer",
      label: "Minimum Fees Percentage",
      description: "Minimum percentage of fees.",
      optional: true,
    },
    feesResponsibility: {
      type: "string",
      label: "Fees Responsibility",
      description: "Responsibility for fees. 0 for seller, 1 for buyer.",
      options: constants.FEE_RESPONSIBILITY,
      optional: true,
    },
    floorQuantityMax: {
      type: "integer",
      label: "Maximum Floor Quantity",
      description: "Maximum number of floors in the property.",
      optional: true,
    },
    floorQuantityMin: {
      type: "integer",
      label: "Minimum Floor Quantity",
      description: "Minimum number of floors in the property.",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Date from which the property is created — inclusive.",
      optional: true,
    },
    fromUpdatedAt: {
      type: "string",
      label: "From Updated At",
      description: "Date from which the property is updated — inclusive.",
      optional: true,
    },
    furnished: {
      type: "boolean",
      label: "Furnished",
      description: "Filter for furnished properties.",
      optional: true,
    },
    greenHouseGasCategories: {
      type: "string[]",
      label: "Green House Gas Categories",
      description: "Green house gas performance letter array of the property.",
      optional: true,
    },
    greenHouseGasValueMax: {
      type: "integer",
      label: "Maximum Green House Gas Value",
      description: "Maximum value of green house gas of the property.",
      optional: true,
    },
    greenHouseGasValueMin: {
      type: "integer",
      label: "Minimum Green House Gas Value",
      description: "Minimum value of green house gas of the property.",
      optional: true,
    },
    includedCities: {
      type: "string[]",
      label: "Included Cities",
      description: "Located in given cities.",
      optional: true,
    },
    includedDepartments: {
      type: "string[]",
      label: "Included Departments",
      description: "Located in given departments.",
      optional: true,
    },
    includedInseeCodes: {
      type: "string[]",
      label: "Included Insee Codes",
      description: "Located in given insee codes.",
      optional: true,
    },
    includedZipcodes: {
      type: "string[]",
      label: "Included Zipcodes",
      description: "Located in given zipcodes.",
      optional: true,
    },
    inventoryPriceMax: {
      type: "integer",
      label: "Maximum Inventory Price",
      description: "Lower than or equal to given inventory price.",
      optional: true,
    },
    inventoryPriceMin: {
      type: "integer",
      label: "Minimum Inventory Price",
      description: "Greater than or equal to given inventory price.",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude. Will work if latitude exists in the property.",
      optional: true,
    },
    lon: {
      type: "string",
      label: "Longitude",
      description: "Longitude. Will work if longitude exists in the property.",
      optional: true,
    },
    lotCountMax: {
      type: "integer",
      label: "Maximum Lot Count",
      description: "Lower than or equal to given lot count.",
      optional: true,
    },
    lotCountMin: {
      type: "integer",
      label: "Minimum Lot Count",
      description: "Greater than or equal to given lot count.",
      optional: true,
    },
    orderCreatedAt: {
      type: "string",
      label: "Order by Creation Date",
      description: "Order properties by creation date. Can be asc or desc.",
      options: constants.ORDER,
      optional: true,
    },
    orderUpdatedAt: {
      type: "string",
      label: "Order by Update Date",
      description: "Order properties by update date. Can be asc or desc.",
      options: constants.ORDER,
      optional: true,
    },
    priceExcludingFeesMax: {
      type: "integer",
      label: "Maximum Price Excluding Fees",
      description: "Lower than or equal to given price excluding fees.",
      optional: true,
    },
    priceExcludingFeesMin: {
      type: "integer",
      label: "Minimum Price Excluding Fees",
      description: "Greater than or equal to given price excluding fees.",
      optional: true,
    },
    pricePerMeterMax: {
      type: "integer",
      label: "Maximum Price Per Meter",
      description: "Lower than or equal to given price per meter.",
      optional: true,
    },
    pricePerMeterMin: {
      type: "integer",
      label: "Minimum Price Per Meter",
      description: "Greater than or equal to given price per meter.",
      optional: true,
    },
    propertyTypes: {
      type: "string[]",
      label: "Property Types",
      description: "Type of property. Apartment 0, House 1, Building 2, Parking 3, Office 4, Land 5, Shop 6.",
      options: constants.PROPERTY_TYPES,
      optional: true,
    },
    publisherTypes: {
      type: "string[]",
      label: "Publisher Types",
      description: "Type of publisher. Individual 0, Professional 1.",
      options: constants.PUBLISHER_TYPES,
      optional: true,
    },
    radius: {
      type: "integer",
      label: "Radius",
      description: "Distance expressed in kilometers. Will work if latitude & longitude parameters are also set.",
      optional: true,
    },
    rentalChargesMax: {
      type: "integer",
      label: "Maximum Rental Charges",
      description: "Lower than or equal to given rental charges amount.",
      optional: true,
    },
    rentalChargesMin: {
      type: "integer",
      label: "Minimum Rental Charges",
      description: "Greater than or equal to given rental charges amount.",
      optional: true,
    },
    rentalPledgeMax: {
      type: "integer",
      label: "Maximum Rental Pledge",
      description: "Lower than or equal to given rental pledge amount.",
      optional: true,
    },
    rentalPledgeMin: {
      type: "integer",
      label: "Minimum Rental Pledge",
      description: "Greater than or equal to given rental pledge amount.",
      optional: true,
    },
    renterFeesMax: {
      type: "integer",
      label: "Maximum Renter Fees",
      description: "Lower than or equal to given renter fees.",
      optional: true,
    },
    renterFeesMin: {
      type: "integer",
      label: "Minimum Renter Fees",
      description: "Greater than or equal to given renter fees.",
      optional: true,
    },
    roomMax: {
      type: "integer",
      label: "Maximum Rooms",
      description: "Maximum rooms of the property.",
      optional: true,
    },
    roomMin: {
      type: "integer",
      label: "Minimum Rooms",
      description: "Minimum rooms of the property.",
      optional: true,
    },
    surfaceMax: {
      type: "integer",
      label: "Surface Max",
      description: "Lower than or equal to given surface.",
      optional: true,
    },
    surfaceMin: {
      type: "integer",
      label: "Surface Min",
      description: "Greater than or equal to given surface.",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "To datetime — inclusive.",
      optional: true,
    },
    toUpdatedAt: {
      type: "string",
      label: "To Updated At",
      description: "Since datetime — inclusive.",
      optional: true,
    },
    transactionType: {
      type: "integer",
      label: "Transaction Type",
      description: "Type of transaction. Sell 0, Rent 1.",
      optional: true,
    },
    withCoherentPrice: {
      type: "boolean",
      label: "With Coherent Price",
      description: "Filter properties with coherent price.",
      optional: true,
      default: true,
    },
    withVirtualTour: {
      type: "boolean",
      label: "With Virtual Tour",
      description: "Having a virtual tour video link.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      melo,
      ...params
    } = this;

    let page = 1;
    let total = 0;
    const itemsPerPage = 30;
    const properties = [];

    do {
      const response = await melo.searchProperties({
        params: {
          ...params,
          page,
          itemsPerPage,
        },
        $,
      });
      properties.push(...response["hydra:member"]);
      total = response["hydra:member"].length;
      page++;
    } while (total === itemsPerPage);

    if (properties.length) {
      $.export("$summary", `Successfully retrieved ${properties.length} propert${properties.length === 1
        ? "y"
        : "ies"}.`);
    }

    return properties;
  },
};
