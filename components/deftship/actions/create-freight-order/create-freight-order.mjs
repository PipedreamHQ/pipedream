import deftship from "../../deftship.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "deftship-create-freight-order",
  name: "Create Freight Order",
  description: "Initializes a new parcel order within Deftship. [See the documentation](https://developer.deftship.com/freight/create-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deftship,
    pickupDate: {
      type: "string",
      label: "Pickup Date",
      description: "Proposed pickup date, in `Y-m-d`",
    },
    fromOpeningTime: {
      type: "string",
      label: "From Opening Time",
      description: "Opening time of pickup address, in `H:i`",
    },
    fromClosingTime: {
      type: "string",
      label: "From Closing Time",
      description: "Closing time of pickup address, in `H:i`",
    },
    fromName: {
      propDefinition: [
        deftship,
        "fromName",
      ],
    },
    fromStreet: {
      propDefinition: [
        deftship,
        "fromStreet",
      ],
    },
    fromCity: {
      propDefinition: [
        deftship,
        "fromCity",
      ],
    },
    fromState: {
      propDefinition: [
        deftship,
        "fromState",
      ],
    },
    fromZip: {
      propDefinition: [
        deftship,
        "fromZip",
      ],
    },
    fromCountry: {
      propDefinition: [
        deftship,
        "fromCountry",
      ],
    },
    fromTelephone: {
      propDefinition: [
        deftship,
        "fromTelephone",
      ],
      description: "The telephone number of the sender. (must be a number 10-15 digits)",
    },
    toOpeningTime: {
      type: "string",
      label: "To Opening Time",
      description: "Opening time of delivery address, in `H:i`",
    },
    toClosingTime: {
      type: "string",
      label: "To Closing Time",
      description: "Closing time of delivery address, in `H:i`",
    },
    toName: {
      propDefinition: [
        deftship,
        "toName",
      ],
    },
    toStreet: {
      propDefinition: [
        deftship,
        "toStreet",
      ],
    },
    toCity: {
      propDefinition: [
        deftship,
        "toCity",
      ],
    },
    toState: {
      propDefinition: [
        deftship,
        "toState",
      ],
    },
    toZip: {
      propDefinition: [
        deftship,
        "toZip",
      ],
    },
    toCountry: {
      propDefinition: [
        deftship,
        "toCountry",
      ],
    },
    toTelephone: {
      propDefinition: [
        deftship,
        "fromTelephone",
      ],
      description: "The telephone number of the sender. (must be a number 10-15 digits)",
    },
    packageType: {
      type: "string",
      label: "Package Type",
      description: "The type of package",
      options: constants.PACKAGE_TYPES,
    },
    itemCount: {
      propDefinition: [
        deftship,
        "itemCount",
      ],
    },
    length: {
      type: "string",
      label: "Length",
      description: "Length (IN)",
    },
    width: {
      type: "string",
      label: "Width",
      description: "Width (IN)",
    },
    height: {
      type: "string",
      label: "Height",
      description: "Height (IN)",
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "Weight (LBS)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item",
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price (Commodity Value) of the item",
      optional: true,
    },
    sku: {
      type: "string",
      label: "Sku",
      description: "PO number of the shipment",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        deftship,
        "additionalFields",
      ],
    },
  },
  async run({ $ }) {
    const additionalFields = !this.additionalFields
      ? {}
      : typeof this.additionalFields === "string"
        ? JSON.parse(this.additionalFields)
        : this.additionalFields;
    const response = await this.deftship.createFreightOrder({
      $,
      data: {
        pickup_date: this.pickupDate,
        from_opening_time: this.fromOpeningTime,
        from_closing_time: this.fromClosingTime,
        from_address: {
          name: this.fromName,
          street_1: this.fromStreet,
          city: this.fromCity,
          state: this.fromState,
          zip: this.fromZip,
          country: this.fromCountry,
          telephone: +this.fromTelephone,
        },
        to_opening_time: this.toOpeningTime,
        to_closing_time: this.toClosingTime,
        to_address: {
          name: this.toName,
          street_1: this.toStreet,
          city: this.toCity,
          state: this.toState,
          zip: this.toZip,
          country: this.toCountry,
          telephone: +this.toTelephone,
        },
        items: [
          {
            package_type: this.packageType,
            count: this.itemCount,
            length: +this.length,
            width: +this.width,
            height: +this.height,
            weight: +this.weight,
            description: this.description,
            price: this.price && +this.price,
            sku: this.sku,
          },
        ],
        ...additionalFields,
      },
    });
    $.export("$summary", `New freight order with ID: ${response.data.shipment_order_id}`);
    return response;
  },
};
