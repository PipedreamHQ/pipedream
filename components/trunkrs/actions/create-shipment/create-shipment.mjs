import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-create-shipment",
  name: "Create Shipment",
  description: "Create a new shipment. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/85ba39933b755-create-shipment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    trunkrs,
    orderReference: {
      type: "string",
      label: "Order Reference",
      description: "Internal order reference provided by customer, this must be unique",
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender",
    },
    senderEmailAddress: {
      type: "string",
      label: "Sender Email Address",
      description: "The email address of the sender",
    },
    senderStreetAddress: {
      type: "string",
      label: "Sender Street Address",
      description: "The street address of the sender",
    },
    senderPostalCode: {
      type: "string",
      label: "Sender Postal Code",
      description: "The postal code of the sender",
    },
    senderCity: {
      type: "string",
      label: "Sender City",
      description: "The city of the sender",
    },
    senderCountry: {
      propDefinition: [
        trunkrs,
        "country",
      ],
      description: "The country of the sender",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the recipient",
    },
    recipientEmailAddress: {
      type: "string",
      label: "Recipient Email Address",
      description: "The email address of the recipient",
    },
    recipientStreetAddress: {
      type: "string",
      label: "Recipient Street Address",
      description: "The street address of the recipient",
    },
    recipientPostalCode: {
      type: "string",
      label: "Recipient Postal Code",
      description: "The postal code of the recipient",
    },
    recipientCity: {
      type: "string",
      label: "Recipient City",
      description: "The city of the recipient",
    },
    recipientCountry: {
      propDefinition: [
        trunkrs,
        "country",
      ],
    },
    parcelWeightUnit: {
      type: "string",
      label: "Parcel Weight Unit",
      description: "The unit of weight for the parcels",
      options: [
        "g",
        "kg",
      ],
    },
    parcelWeights: {
      type: "string[]",
      label: "Parcel Weights",
      description: "An array of weights for the parcels in the unit provided by the parcelWeightUnit prop",
    },
    timeSlotId: {
      propDefinition: [
        trunkrs,
        "timeSlotId",
        (c) => ({
          country: c.recipientCountry,
          postalCode: c.recipientPostalCode,
        }),
      ],
    },
    service: {
      type: "string",
      label: "Service",
      description: "Specifies the service level of this parcel. To use the freezer service, set the value to SAME_DAY_FROZEN_FOOD.",
      options: [
        "SAME_DAY",
        "SAME_DAY_FROZEN_FOOD",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.trunkrs.createShipment({
      $,
      data: {
        orderReference: this.orderReference,
        sender: {
          name: this.senderName,
          emailAddress: this.senderEmailAddress,
          address: this.senderStreetAddress,
          postalCode: this.senderPostalCode,
          city: this.senderCity,
          country: this.senderCountry,
        },
        recipient: {
          name: this.recipientName,
          emailAddress: this.recipientEmailAddress,
          address: this.recipientStreetAddress,
          postalCode: this.recipientPostalCode,
          city: this.recipientCity,
          country: this.recipientCountry,
        },
        parcel: this.parcelWeights.map((weight) => ({
          weight: {
            unit: this.parcelWeightUnit,
            value: +weight,
          },
        })),
        timeSlotId: this.timeSlotId,
        service: this.service,
      },
    });
    $.export("$summary", "Successfully created shipment.");
    return data;
  },
};
