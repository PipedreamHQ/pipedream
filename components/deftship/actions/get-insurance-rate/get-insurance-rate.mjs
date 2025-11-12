import deftship from "../../deftship.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "deftship-get-insurance-rate",
  name: "Get Insurance Rate",
  description: "Checks pricing for Insurance based on the supplied information. Also automatically creates an insurance and returns the pricing. [See the documentation](https://developer.deftship.com/insurance/get-rates)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deftship,
    carrier: {
      type: "string",
      label: "Insurance Carrier",
      description: "Carrier of the order going to be insured",
      async options() {
        return constants.INSURANCE_CARRIERS;
      },
    },
    serviceCode: {
      propDefinition: [
        deftship,
        "serviceCode",
        (c) => ({
          carrier: c.carrier,
        }),
      ],
    },
    shipmentDate: {
      type: "string",
      label: "Shipment Date",
      description: "Shipment date, in `Y-m-d`",
    },
    fromName: {
      propDefinition: [
        deftship,
        "fromName",
      ],
    },
    fromAttention: {
      propDefinition: [
        deftship,
        "fromAttention",
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
    toAttention: {
      propDefinition: [
        deftship,
        "toAttention",
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
        "toTelephone",
      ],
    },
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "Tracking number of the package going to be insured",
    },
    itemDescription: {
      type: "string",
      label: "Item",
      description: "Description of the item being shipped",
    },
    itemQuantity: {
      type: "integer",
      label: "Quantity",
      description: "Item piece count",
    },
    itemPrice: {
      type: "string",
      label: "Price",
      description: "Item piece price",
    },
    isInternational: {
      type: "boolean",
      label: "Is International",
      description: "Set to `true` if the shipment is international",
      default: false,
      optional: true,
    },
    isFreight: {
      type: "boolean",
      label: "Is Freight",
      description: "Set to `true` if the shipment is freight",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deftship.getInsuranceRates({
      $,
      data: {
        carrier: this.carrier,
        service_code: this.serviceCode,
        shipment_date: this.shipmentDate,
        from_address: {
          name: this.fromName,
          attention: this.fromAttention,
          street_1: this.fromStreet,
          city: this.fromCity,
          state: this.fromState,
          zip: this.fromZip,
          country: this.fromCountry,
          telephone: this.fromTelephone,
        },
        to_address: {
          name: this.toName,
          attention: this.toAttention,
          street_1: this.toStreet,
          city: this.toCity,
          state: this.toState,
          zip: this.toZip,
          country: this.toCountry,
          telephone: this.toTelephone,
        },
        package_list: [
          {
            tracking_number: this.trackingNumber,
            items: [
              {
                description: this.itemDescription,
                quantity: this.itemQuantity,
                price: +this.itemPrice,
              },
            ],
          },
        ],
        is_international: this.isInternational,
        is_freight: this.isFreight,
      },
    });
    $.export("$summary", `Successfully retrieved insurance rate with ID: ${response.data.id}`);
    return response;
  },
};
