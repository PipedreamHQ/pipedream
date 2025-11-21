import ups from "../../ups.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ups-create-shipment",
  name: "Create Shipment",
  description: "Create a new shipment. [See the documentation](https://developer.ups.com/tag/Shipping?loc=en_US#operation/Shipment)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ups,
    shipperName: {
      type: "string",
      label: "Shipper Name",
      description: "The name of the shipper",
    },
    shipperNumber: {
      type: "string",
      label: "Shipper Number",
      description: "Shipper's six digit alphanumeric account number",
    },
    shipperAddressLine: {
      type: "string",
      label: "Shipper Address Line",
      description: "The address line of the shipper",
    },
    shipperCity: {
      type: "string",
      label: "Shipper City",
      description: "The city of the shipper",
    },
    shipperStateProvinceCode: {
      type: "string",
      label: "Shipper State Province Code",
      description: "The state province code of the shipper",
    },
    shipperPostalCode: {
      type: "string",
      label: "Shipper Postal Code",
      description: "The postal code of the shipper",
    },
    shipperCountryCode: {
      type: "string",
      label: "Shipper Country Code",
      description: "The country code of the shipper",
    },
    shipToName: {
      type: "string",
      label: "Ship To Name",
      description: "The name of the ship to",
    },
    shipToAddressLine: {
      type: "string",
      label: "Ship To Address Line",
      description: "The address line of the ship to",
    },
    shipToCity: {
      type: "string",
      label: "Ship To City",
      description: "The city of the ship to",
    },
    shipToStateProvinceCode: {
      type: "string",
      label: "Ship To State Province Code",
      description: "The state province code of the ship to",
    },
    shipToPostalCode: {
      type: "string",
      label: "Ship To Postal Code",
      description: "The postal code of the ship to",
    },
    shipToCountryCode: {
      type: "string",
      label: "Ship To Country Code",
      description: "The country code of the ship to",
    },
    serviceCode: {
      type: "string",
      label: "Service Code",
      description: "The code of the service",
      options: constants.SERVICE_CODES,
    },
    packagingCode: {
      type: "string",
      label: "Packaging Code",
      description: "The code of the packaging",
      options: constants.PACKAGING_CODES,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "The unit of weight for the package",
      options: [
        "LBS",
        "KGS",
        "OZS",
      ],
    },
    packageWeight: {
      type: "string",
      label: "Package Weight",
      description: "The weight of the package",
    },
  },
  async run({ $ }) {
    const response = await this.ups.createShipment({
      $,
      data: {
        ShipmentRequest: {
          Request: {
            RequestOption: "nonvalidate",
          },
          Shipment: {
            Shipper: {
              Name: this.shipperName,
              ShipperNumber: this.shipperNumber,
              Address: {
                AddressLine: this.shipperAddressLine,
                City: this.shipperCity,
                StateProvinceCode: this.shipperStateProvinceCode,
                PostalCode: this.shipperPostalCode,
                CountryCode: this.shipperCountryCode,
              },
            },
            ShipTo: {
              Name: this.shipToName,
              Address: {
                AddressLine: this.shipToAddressLine,
                City: this.shipToCity,
                StateProvinceCode: this.shipToStateProvinceCode,
                PostalCode: this.shipToPostalCode,
                CountryCode: this.shipToCountryCode,
              },
            },
            PaymentInformation: {
              ShipmentCharge: [
                {
                  Type: "01", // Transportation Charge
                  BillShipper: {
                    AccountNumber: this.shipperNumber,
                  },
                },
              ],
            },
            Service: {
              Code: this.serviceCode,
            },
            Package: [
              {
                Packaging: {
                  Code: this.packagingCode,
                },
                PackageWeight: {
                  UnitOfMeasurement: {
                    Code: this.weightUnit,
                  },
                  Weight: this.packageWeight,
                },
              },
            ],
          },
        },
      },
    });
    $.export("$summary", "Shipment created successfully");
    return response;
  },
};
