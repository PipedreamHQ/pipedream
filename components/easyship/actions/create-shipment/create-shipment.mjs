import easyship from "../../easyship.app.mjs";

export default {
  key: "easyship-create-shipment",
  name: "Create Shipment",
  description: "Create a new shipment in Easyship. [See the docs](https://developers.easyship.com/reference/shipments_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    easyship,
    originContactName: {
      type: "string",
      label: "Origin Name",
      description: "The full name of a person at the origin address",
    },
    originContactEmail: {
      type: "string",
      label: "Origin Email",
      description: "Email address used to reach the person in `Origin Name`",
    },
    originContactPhone: {
      type: "string",
      label: "Origin Phone Number",
      description: "Phone number used to reach the person in `Origin Name` (may or may not be SMS-ready)",
    },
    originCompanyName: {
      type: "string",
      label: "Origin Company Name",
      description: "The company or organization at the originaddress",
    },
    originLine1: {
      type: "string",
      label: "Origin Street Address",
      description: "Street address of the origin address",
    },
    originCity: {
      type: "string",
      label: "Origin City",
      description: "City of the origin address",
    },
    originState: {
      type: "string",
      label: "Origin State",
      description: "State, Province, or other top-level administrative region of the origin address",
    },
    originPostalCode: {
      type: "string",
      label: "Origin Postal Code",
      description: "Postal code of the origin address",
    },
    originCountry: {
      type: "string",
      label: "Origin Country (Alpha-2 Code)",
      description: "ISO 3166-1 alpha-2 code of the origin country",
      optional: true,
    },
    destinationName: {
      type: "string",
      label: "Destination Name",
      description: "The full name of a person at the destination address.",
    },
    destinationEmail: {
      type: "string",
      label: "Destination Email",
      description: "Email address used to reach the person at the destination address.",
    },
    destinationPhoneNumber: {
      type: "string",
      label: "Destination Phone Number",
      description: "Phone number used to reach the person at the destination address (may or may not be SMS-ready).",
    },
    destinationCompanyName: {
      type: "string",
      label: "Destination Company Name",
      description: "The company or organization at the destination address.",
      optional: true,
    },
    destinationStreetAddress: {
      type: "string",
      label: "Destination Street Address",
      description: "Street address of the destination address.",
    },
    destinationCity: {
      type: "string",
      label: "Destination City",
      description: "City of the destination address.",
    },
    destinationState: {
      type: "string",
      label: "Destination State",
      description: "State, Province, or other top-level administrative region of the destination address.",
    },
    destinationPostalCode: {
      type: "string",
      label: "Destination Postal Code",
      description: "Postal code of the destination address.",
    },
    destinationCountry: {
      type: "string",
      label: "Destination Country (Alpha-2 Code)",
      description: "ISO 3166-1 alpha-2 code of the destination country.",
    },
    numberOfParcels: {
      type: "integer",
      label: "Number of Parcels",
      description: "The number of parcels to ship",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.numberOfParcels > 0) {
      for (let i = 1; i <= this.numberOfParcels; i++) {
        props[`parcelWeight${i}`] = {
          type: "string",
          label: `Parcel ${i} Weight (kg)`,
          description: `Item actual weight in kg of parcel ${i}`,
        };
        props[`parcelLength${i}`] = {
          type: "string",
          label: `Parcel ${i} Length (cm)`,
          description: `Length of parcel ${i}`,
        };
        props[`parcelWidth${i}`] = {
          type: "string",
          label: `Parcel ${i} Width (cm)`,
          description: `Width of parcel ${i}`,
        };
        props[`parcelHeight${i}`] = {
          type: "string",
          label: `Parcel ${i} Height (cm)`,
          description: `Height of parcel ${i}`,
        };
        props[`parcelDescription${i}`] = {
          type: "string",
          label: `Parcel ${i} Description`,
          description: `Description of parcel ${i}`,
        };
        props[`parcelValue${i}`] = {
          type: "string",
          label: `Parcel ${i} Value`,
          description: `Value of parcel ${i}`,
        };
        props[`parcelCurrency${i}`] = {
          type: "string",
          label: `Parcel ${i} Currency`,
          description: `Currency of parcel ${i} value`,
        };
        props[`parcelCategory${i}`] = {
          type: "string",
          label: `Parcel ${i} Category`,
          description: `Category of parcel ${i}`,
          options: await this.getCategoriesOptions(),
        };
      }
    }
    return props;
  },
  methods: {
    async getCategoriesOptions() {
      const categories = await this.easyship.getPaginatedResources({
        fn: this.easyship.listCategories,
        resourceKey: "item_categories",
      });
      return categories.map((c) => ({
        label: c.name,
        value: c.slug,
      }));
    },
  },
  async run({ $ }) {
    const parcelItems = [];
    for (let i = 1; i <= this.numberOfParcels; i++) {
      parcelItems.push({
        dimensions: {
          length: this[`parcelLength${i}`],
          width: this[`parcelWidth${i}`],
          height: this[`parcelHeight${i}`],
        },
        actual_weight: this[`parcelWeight${i}`],
        description: this[`parcelDescription${i}`],
        declared_customs_value: this[`parcelValue${i}`],
        declared_currency: this[`parcelCurrency${i}`] || "USD",
        category: this[`parcelCategory${i}`],
      });
    }
    const response = await this.easyship.createShipment({
      $,
      data: {
        origin_address: {
          contact_name: this.originContactName,
          contact_email: this.originContactEmail,
          contact_phone: this.originContactPhone,
          company_name: this.originCompanyName,
          line_1: this.originLine1,
          city: this.originCity,
          state: this.originState,
          postal_code: this.originPostalCode,
          country_alpha2: this.originCountry,
        },
        destination_address: {
          contact_name: this.destinationName,
          contact_email: this.destinationEmail,
          contact_phone: this.destinationPhoneNumber,
          company_name: this.destinationCompanyName,
          line_1: this.destinationStreetAddress,
          city: this.destinationCity,
          state: this.destinationState,
          postal_code: this.destinationPostalCode,
          country_alpha2: this.destinationCountry,
        },
        parcels: [
          {
            items: parcelItems,
          },
        ],
      },
    });
    $.export("$summary", `Created shipment with ID: ${response.shipment.easyship_shipment_id}`);
    return response;
  },
};
