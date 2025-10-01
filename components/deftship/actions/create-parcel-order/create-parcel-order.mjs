import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-create-parcel-order",
  name: "Create Parcel Order",
  description: "Initializes a new parcel order within Deftship. [See the documentation](https://developer.deftship.com/parcel/create-parcel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deftship,
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
      description: "Length of the parcel",
    },
    width: {
      type: "string",
      label: "Width",
      description: "Width of the parcel",
    },
    height: {
      type: "string",
      label: "Height",
      description: "Height of the parcel",
    },
    lengthUnit: {
      type: "string",
      label: "Length Unit",
      description: "By default, length unit is taken from your preferences. However, it can be overwritten using this field.",
      optional: true,
      options: [
        "IN",
        "CM",
      ],
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "Weight of the parcel",
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "By default, weight unit is taken from your preferences. However, it can be overwritten using this field.",
      optional: true,
      options: [
        "LBS",
        "KG",
      ],
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
    const response = await this.deftship.createParcelOrder({
      $,
      data: {
        from_address: {
          name: this.fromName,
          street_1: this.fromStreet,
          city: this.fromCity,
          state: this.fromState,
          zip: this.fromZip,
          country: this.fromCountry,
          telephone: this.fromTelephone,
        },
        to_address: {
          name: this.toName,
          street_1: this.toStreet,
          city: this.toCity,
          state: this.toState,
          zip: this.toZip,
          country: this.toCountry,
          telephone: this.toTelephone,
        },
        weight_unit: this.weightUnit,
        length_unit: this.lengthUnit,
        package_list: [
          {
            count: this.itemCount,
            length: +this.length,
            width: +this.width,
            height: +this.height,
            weight: +this.weight,
          },
        ],
        ...additionalFields,
      },
    });
    $.export("$summary", `Successfully created parcel order with ID: ${response.data.shipment_order_id}`);
    return response;
  },
};
