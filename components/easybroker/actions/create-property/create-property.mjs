import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-create-property",
  name: "Create Property",
  description: "Creates a new property listing in EasyBroker with full details including title, price, location, bedrooms, bathrooms, parking, size, description, amenities, photos, and status. [See the documentation](https://dev.easybroker.com/reference/post_properties)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    easybroker,
    propertyType: {
      type: "string",
      label: "Property Type",
      description: "The name of the property type. Use the **List Property Types** action to retrieve all available values. Example: `Casa`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The property listing title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The property listing description",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The property listing status",
      options: [
        "published",
        "sold",
        "rented",
        "reserved",
        "suspended",
        "not_published",
      ],
    },
    operations: {
      type: "any",
      label: "Operations",
      description: "An array of operation objects. For a sale or rental: `[{\"type\":\"sale\",\"currency\":\"USD\",\"amount\":250000,\"active\":true}]`. For a temporary rental: `[{\"type\":\"temporary_rental\",\"currency\":\"USD\",\"active\":true,\"rates\":[{\"type\":\"daily\",\"amount\":150}]}]`. Accepted `type` values: `sale`, `rental`, `temporary_rental`. Optional fields per operation: `unit` (enum: `total`, `square_meter`, `hectare`), `commission` ({`type`: `amount`|`percentage`|`months`, `value`: number, `currency`: string}), `foreclosure` (boolean, Mexico only)",
    },
    locationName: {
      type: "string",
      label: "Location Name",
      description: "Location in `Neighborhood, City, State` format matching a location from the locations endpoint. Example: `Polanco, Ciudad de México, Ciudad de México`",
      optional: true,
    },
    locationStreet: {
      type: "string",
      label: "Location Street",
      description: "Street name. Required by the API if the property is not land-type and `Show Exact Location` is enabled",
      optional: true,
    },
    locationExteriorNumber: {
      type: "string",
      label: "Location Exterior Number",
      description: "Address exterior number",
      optional: true,
    },
    locationInteriorNumber: {
      type: "string",
      label: "Location Interior Number",
      description: "Address interior number",
      optional: true,
    },
    locationCrossStreet: {
      type: "string",
      label: "Location Cross Street",
      description: "Intersecting street name",
      optional: true,
    },
    locationPostalCode: {
      type: "string",
      label: "Location Postal Code",
      description: "Postal/zip code",
      optional: true,
    },
    locationLatitude: {
      type: "integer",
      label: "Location Latitude",
      description: "Geographic latitude coordinate",
      optional: true,
    },
    locationLongitude: {
      type: "integer",
      label: "Location Longitude",
      description: "Geographic longitude coordinate",
      optional: true,
    },
    privateDescription: {
      type: "string",
      label: "Private Description",
      description: "Internal notes visible only to your team",
      optional: true,
    },
    agent: {
      type: "string",
      label: "Agent",
      description: "EasyBroker account email of the assigned agent",
      optional: true,
    },
    showPrices: {
      type: "boolean",
      label: "Show Prices",
      description: "Show or hide listing prices on EasyBroker",
      optional: true,
    },
    bedrooms: {
      type: "integer",
      label: "Bedrooms",
      description: "Number of bedrooms",
      optional: true,
    },
    bathrooms: {
      type: "integer",
      label: "Bathrooms",
      description: "Number of bathrooms",
      optional: true,
    },
    halfBathrooms: {
      type: "integer",
      label: "Half Bathrooms",
      description: "Number of half bathrooms",
      optional: true,
    },
    parkingSpaces: {
      type: "integer",
      label: "Parking Spaces",
      description: "Number of parking spaces",
      optional: true,
    },
    age: {
      type: "string",
      label: "Age",
      description: "Property age. Use `under_construction`, `new_construction`, or a four-digit construction year. Example: `2010`",
      optional: true,
    },
    floor: {
      type: "string",
      label: "Floor",
      description: "Floor number or a custom value. Example: `Penthouse`",
      optional: true,
    },
    floors: {
      type: "integer",
      label: "Floors",
      description: "Number of floors in the building",
      optional: true,
    },
    expenses: {
      type: "string",
      label: "Expenses",
      description: "Monthly property expenses amount",
      optional: true,
    },
    internalId: {
      type: "string",
      label: "Internal ID",
      description: "Unique organizational ID. Accepts letters, numbers, hyphens, underscores, commas, periods, ampersands, and forward slashes",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Associated tags for the property",
      optional: true,
    },
    features: {
      type: "string[]",
      label: "Features",
      description: "Property feature names from the [features endpoint](https://dev.easybroker.com/reference/get_features)",
      optional: true,
    },
    shareCommission: {
      type: "boolean",
      label: "Share Commission",
      description: "Share commission with other agencies",
      optional: true,
    },
    collaborationNotes: {
      type: "string",
      label: "Collaboration Notes",
      description: "Collaboration conditions or details",
      optional: true,
    },
    images: {
      type: "any",
      label: "Images",
      description: "An array of image objects. Each object requires a `url` (valid HTTP/HTTPS URL with `.jpg`, `.png`, `.gif`, `.bmp`, or `.heic` extension) and accepts an optional `title`. Maximum 50 images, 6MB per image, minimum 500px. Example: `[{\"url\":\"https://example.com/image.jpg\",\"title\":\"Front view\"}]`",
      optional: true,
    },
    videos: {
      type: "string[]",
      label: "Videos",
      description: "YouTube video links for the property",
      optional: true,
    },
    virtualTour: {
      type: "string",
      label: "Virtual Tour",
      description: "Virtual tour URL",
      optional: true,
    },
    showExactLocation: {
      type: "boolean",
      label: "Show Exact Location",
      description: "Show or hide the exact address and map pin",
      optional: true,
    },
    constructionSize: {
      type: "integer",
      label: "Construction Size",
      description: "Construction size in square meters",
      optional: true,
    },
    lotSize: {
      type: "integer",
      label: "Lot Size",
      description: "Lot size in square meters",
      optional: true,
    },
    lotLength: {
      type: "integer",
      label: "Lot Length",
      description: "Lot length in meters",
      optional: true,
    },
    lotWidth: {
      type: "integer",
      label: "Lot Width",
      description: "Lot width in meters",
      optional: true,
    },
    coveredSpace: {
      type: "integer",
      label: "Covered Space",
      description: "Covered space in square meters (unavailable in Mexico)",
      optional: true,
    },
    uncoveredSpace: {
      type: "integer",
      label: "Uncovered Space",
      description: "Uncovered space in square meters (Mexico and Argentina only)",
      optional: true,
    },
    exclusive: {
      type: "boolean",
      label: "Exclusive",
      description: "Listing exclusivity indicator",
      optional: true,
    },
    sharedCommissionPercentage: {
      type: "integer",
      label: "Shared Commission Percentage",
      description: "Agency fee percentage shared with other agencies. Currently only `50` or leave blank for none",
      optional: true,
    },
  },
  async run({ $ }) {
    const location = {
      ...(this.locationName && {
        name: this.locationName,
      }),
      ...(this.locationStreet && {
        street: this.locationStreet,
      }),
      ...(this.locationExteriorNumber && {
        exterior_number: this.locationExteriorNumber,
      }),
      ...(this.locationInteriorNumber && {
        interior_number: this.locationInteriorNumber,
      }),
      ...(this.locationCrossStreet && {
        cross_street: this.locationCrossStreet,
      }),
      ...(this.locationPostalCode && {
        postal_code: this.locationPostalCode,
      }),
      ...(this.locationLatitude !== undefined && {
        latitude: this.locationLatitude,
      }),
      ...(this.locationLongitude !== undefined && {
        longitude: this.locationLongitude,
      }),
    };

    const response = await this.easybroker.createProperty({
      $,
      data: {
        property_type: this.propertyType,
        title: this.title,
        description: this.description,
        status: this.status,
        operations: this.operations,
        location,
        ...(this.privateDescription && {
          private_description: this.privateDescription,
        }),
        ...(this.agent && {
          agent: this.agent,
        }),
        ...(this.showPrices !== undefined && {
          show_prices: this.showPrices,
        }),
        ...(this.bedrooms !== undefined && {
          bedrooms: this.bedrooms,
        }),
        ...(this.bathrooms !== undefined && {
          bathrooms: this.bathrooms,
        }),
        ...(this.halfBathrooms !== undefined && {
          half_bathrooms: this.halfBathrooms,
        }),
        ...(this.parkingSpaces !== undefined && {
          parking_spaces: this.parkingSpaces,
        }),
        ...(this.age && {
          age: this.age,
        }),
        ...(this.floor && {
          floor: this.floor,
        }),
        ...(this.floors !== undefined && {
          floors: this.floors,
        }),
        ...(this.expenses && {
          expenses: this.expenses,
        }),
        ...(this.internalId && {
          internal_id: this.internalId,
        }),
        ...(this.tags && {
          tags: this.tags,
        }),
        ...(this.features && {
          features: this.features,
        }),
        ...(this.shareCommission !== undefined && {
          share_commission: this.shareCommission,
        }),
        ...(this.collaborationNotes && {
          collaboration_notes: this.collaborationNotes,
        }),
        ...(this.images && {
          images: this.images,
        }),
        ...(this.videos && {
          videos: this.videos,
        }),
        ...(this.virtualTour && {
          virtual_tour: this.virtualTour,
        }),
        ...(this.showExactLocation !== undefined && {
          show_exact_location: this.showExactLocation,
        }),
        ...(this.constructionSize !== undefined && {
          construction_size: this.constructionSize,
        }),
        ...(this.lotSize !== undefined && {
          lot_size: this.lotSize,
        }),
        ...(this.lotLength !== undefined && {
          lot_length: this.lotLength,
        }),
        ...(this.lotWidth !== undefined && {
          lot_width: this.lotWidth,
        }),
        ...(this.coveredSpace !== undefined && {
          covered_space: this.coveredSpace,
        }),
        ...(this.uncoveredSpace !== undefined && {
          uncovered_space: this.uncoveredSpace,
        }),
        ...(this.exclusive !== undefined && {
          exclusive: this.exclusive,
        }),
        ...(this.sharedCommissionPercentage !== undefined && {
          shared_commission_percentage: this.sharedCommissionPercentage,
        }),
      },
    });
    $.export("$summary", `Successfully created property with ID: ${response.public_id}`);
    return response;
  },
};
