import melo from "../../melo.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "melo-new-property-created",
  name: "New Property Created (Instant)",
  description: "Emit new event when a new property ad is created in Melo. Requires a Production Environment.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    melo,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the created search.",
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "Type of transaction. Sell 0, Rent 1.",
      options: constants.TRANSACTION_TYPES,
    },
    propertyTypes: {
      type: "string[]",
      label: "Property Types",
      description: "Type of property. Apartment 0, House 1, Building 2, Parking 3, Office 4, Land 5, Shop 6. Example: propertyTypes[]=0&propertyTypes[]=1",
      options: constants.PROPERTY_TYPES,
    },
    bedroomMin: {
      type: "integer",
      label: "Minimum Bedrooms",
      description: "Minimum number of bedrooms in the property.",
      optional: true,
    },
    bedroomMax: {
      type: "integer",
      label: "Maximum Bedrooms",
      description: "Maximum number of bedrooms in the property.",
      optional: true,
    },
    budgetMin: {
      type: "integer",
      label: "Minimum Budget",
      description: "Minimum budget for the property.",
      optional: true,
    },
    budgetMax: {
      type: "integer",
      label: "Maximum Budget",
      description: "Maximum budget for the property.",
    },
    excludedCities: {
      type: "string[]",
      label: "Excluded Cities",
      description: "Cities to be excluded.",
      optional: true,
    },
    excludedSiteCategories: {
      type: "string[]",
      label: "Excluded Site Categories",
      description: "Site categories to be excluded.",
      optional: true,
    },
    furnished: {
      type: "boolean",
      label: "Furnished",
      description: "Whether the property is furnished or not.",
      optional: true,
    },
    hidePropertyContact: {
      type: "boolean",
      label: "Hide Property Contact",
      description: "Whether to hide property contact information or not.",
      optional: true,
    },
    includedCities: {
      type: "string[]",
      label: "Included Cities",
      description: "Included cities.",
      optional: true,
    },
    includedDepartments: {
      type: "string[]",
      label: "Included Departments",
      description: "Included departments.",
      optional: true,
    },
    includedSiteCategories: {
      type: "string[]",
      label: "Included Site Categories",
      description: "Included site categories.",
      optional: true,
    },
    includedZipcodes: {
      type: "string[]",
      label: "Included Zipcodes",
      description: "Included zipcodes.",
      optional: true,
    },
    landSurfaceMax: {
      type: "integer",
      label: "Maximum Land Surface",
      description: "Maximum land surface.",
      optional: true,
    },
    landSurfaceMin: {
      type: "integer",
      label: "Minimum Land Surface",
      description: "Minimum land surface.",
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
      description: "Longitude. Will work if latitude exists in the property.",
      optional: true,
    },
    pricePerMeterMax: {
      type: "integer",
      label: "Maximum Price Per Meter",
      description: "Maximum price per meter.",
      optional: true,
    },
    pricePerMeterMin: {
      type: "integer",
      label: "Minimum Price Per Meter",
      description: "Minimum price per meter.",
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
    roomMin: {
      type: "integer",
      label: "Minimum Number of Rooms",
      description: "Minimum number of rooms.",
      optional: true,
    },
    roomMax: {
      type: "integer",
      label: "Maximum Number of Rooms",
      description: "Maximum number of rooms.",
      optional: true,
    },
    surfaceMax: {
      type: "integer",
      label: "Maximum Surface Area",
      description: "Maximum property surface area.",
      optional: true,
    },
    surfaceMin: {
      type: "integer",
      label: "Minimum Surface Area",
      description: "Minimum property surface area.",
      optional: true,
    },
    withCoherentPrice: {
      type: "boolean",
      label: "With Coherent Price",
      description: "Having properties with coherent prices.",
      optional: true,
      default: true,
    },
    withVirtualTour: {
      type: "boolean",
      label: "With Virtual Tour",
      description: "Whether the property includes a virtual tour.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      if (!this.includedCities?.length
        && !this.includedDepartments?.length
        && !(this.lat && this.lon && this.radius)
      ) {
        throw new ConfigurationError("Choose at least one location. IncludedCities or includedDepartments or radius/lon/lat.");
      }

      const {
        melo,
        http,
        transactionType,
        propertyTypes,
        publisherTypes,
        lat,
        lon,
        ...data
      } = this;

      try {
        await melo.createSearch({
          data: {
            subscribedEvents: [
              "property.ad.create",
            ],
            notificationEnabled: true,
            endpointRecipient: http.endpoint,
            transactionType: parseInt(transactionType),
            propertyTypes: propertyTypes.map((type) => parseInt(type)),
            publisherTypes: publisherTypes?.length
              ? publisherTypes.map((type) => parseInt(type))
              : undefined,
            lat: lat
              ? parseFloat(lat)
              : undefined,
            lon: lon
              ? parseFloat(lon)
              : undefined,
            ...data,
          },
        });
      } catch (e) {
        const message = JSON.parse(e.message);
        if (message["hydra:description"] === "Access Denied.") {
          throw new ConfigurationError(`${message["hydra:description"]} Creating webhooks requires a Production Environment API Key.`);
        }
        throw new Error(JSON.stringify(message));
      }
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    this.$emit(body, {
      id: body.match["@id"],
      summary: `${body.match.propertyDocument.title}`,
      ts: Date.parse(body.match.createdAt),
    });
  },
};
