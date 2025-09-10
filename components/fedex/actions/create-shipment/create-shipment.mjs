import fedex from "../../fedex.app.mjs";

export default {
  key: "fedex-create-shipment",
  name: "Create Shipment",
  description: "Create a new shipment. [See the documentation](https://developer.fedex.com/api/en-us/catalog/ship/docs.html#operation/Create%20Shipment)",
  version: "0.0.1",
  type: "action",
  props: {
    fedex,
    accountNumber: {
      propDefinition: [
        fedex,
        "accountNumber",
      ],
    },
    shipperStreetLines: {
      propDefinition: [
        fedex,
        "shipperStreetLines",
      ],
    },
    shipperCity: {
      propDefinition: [
        fedex,
        "shipperCity",
      ],
    },
    shipperStateOrProvinceCode: {
      propDefinition: [
        fedex,
        "shipperStateOrProvinceCode",
      ],
    },
    shipperPostalCode: {
      propDefinition: [
        fedex,
        "shipperPostalCode",
      ],
    },
    shipperCountryCode: {
      propDefinition: [
        fedex,
        "shipperCountryCode",
      ],
    },
    shipperContactName: {
      propDefinition: [
        fedex,
        "shipperContactName",
      ],
    },
    shipperPhoneNumber: {
      propDefinition: [
        fedex,
        "shipperPhoneNumber",
      ],
    },
    recipientStreetLines: {
      propDefinition: [
        fedex,
        "recipientStreetLines",
      ],
    },
    recipientCity: {
      propDefinition: [
        fedex,
        "recipientCity",
      ],
    },
    recipientStateOrProvinceCode: {
      propDefinition: [
        fedex,
        "recipientStateOrProvinceCode",
      ],
    },
    recipientPostalCode: {
      propDefinition: [
        fedex,
        "recipientPostalCode",
      ],
    },
    recipientCountryCode: {
      propDefinition: [
        fedex,
        "recipientCountryCode",
      ],
    },
    recipientContactName: {
      propDefinition: [
        fedex,
        "recipientContactName",
      ],
    },
    recipientPhoneNumber: {
      propDefinition: [
        fedex,
        "recipientPhoneNumber",
      ],
    },
    pickupType: {
      propDefinition: [
        fedex,
        "pickupType",
      ],
    },
    serviceType: {
      propDefinition: [
        fedex,
        "serviceType",
      ],
    },
    packagingType: {
      propDefinition: [
        fedex,
        "packagingType",
      ],
    },
    totalWeight: {
      propDefinition: [
        fedex,
        "totalWeight",
      ],
    },
    paymentType: {
      propDefinition: [
        fedex,
        "paymentType",
      ],
    },
    labelFormatType: {
      propDefinition: [
        fedex,
        "labelFormatType",
      ],
    },
    labelStockType: {
      propDefinition: [
        fedex,
        "labelStockType",
      ],
    },
    imageType: {
      propDefinition: [
        fedex,
        "imageType",
      ],
    },
    weightUnit: {
      propDefinition: [
        fedex,
        "weightUnit",
      ],
    },
    weights: {
      propDefinition: [
        fedex,
        "weights",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fedex.createShipment({
      $,
      data: {
        accountNumber: {
          value: this.accountNumber,
        },
        labelResponseOptions: "URL_ONLY",
        requestedShipment: {
          shipper: {
            address: {
              streetLines: this.shipperStreetLines,
              city: this.shipperCity,
              stateOrProvinceCode: this.shipperStateOrProvinceCode,
              postalCode: this.shipperPostalCode,
              countryCode: this.shipperCountryCode,
            },
            contact: {
              personName: this.shipperContactName,
              phoneNumber: this.shipperPhoneNumber,
            },
          },
          recipients: [
            {
              address: {
                streetLines: this.recipientStreetLines,
                city: this.recipientCity,
                stateOrProvinceCode: this.recipientStateOrProvinceCode,
                postalCode: this.recipientPostalCode,
                countryCode: this.recipientCountryCode,
              },
              contact: {
                personName: this.recipientContactName,
                phoneNumber: this.recipientPhoneNumber,
              },
            },
          ],
          pickupType: this.pickupType,
          serviceType: this.serviceType,
          packagingType: this.packagingType,
          totalWeight: +this.totalWeight,
          shippingChargesPayment: {
            paymentType: this.paymentType,
          },
          labelSpecification: {
            labelFormatType: this.labelFormatType,
            labelStockType: this.labelStockType,
            imageType: this.imageType,
          },
          requestedPackageLineItems: this.weights.map((weight) => ({
            weight: {
              units: this.weightUnit,
              value: +weight,
            },
          })),
        },
      },
    });
    $.export("$summary", "Shipment created successfully");
    return response;
  },
};
