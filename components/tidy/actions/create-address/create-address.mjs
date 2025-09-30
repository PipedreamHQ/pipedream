import tidy from "../../tidy.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "tidy-create-address",
  name: "Create Address",
  description: "Creates a new address in Tidy. See the documentation(https://help.tidy.com/create-an-address)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tidy,
    address: {
      type: "string",
      label: "Street Address",
      description: "Street number and name. Commonly referred to as address1",
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Any Apt/Unit/etc. Commonly referred to as address2",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Valid Postal Code",
    },
    city: {
      type: "string",
      label: "City",
      description: "City",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Valid 2 Digit Country Code (US by default). Here is a list of valid codes: https://www.iban.com/country-codes",
      default: "US",
      optional: true,
    },
    addressName: {
      type: "string",
      label: "Address Name",
      description: "Address Name",
      optional: true,
    },
    paidParking: {
      type: "boolean",
      label: "Paid Parking",
      description: "Does parking require an upfront payment?",
    },
    parkingSpot: {
      type: "string",
      label: "Parking Spot",
      description: "Describe the parking spot for the Provider",
      options: constants.PARKING_SPOT,
    },
    parkingNotes: {
      type: "string",
      label: "Parking Notes",
      description: "Notes about parking",
    },
    maxParkingCost: {
      type: "integer",
      label: "Max Parking Cost",
      description: "If paying with card, what is the maximum amount the Provider can get automatic approval? Reimbursements over this amount will require manual verification of reimbursement. This field does not accept decimals, so the value is in \"cents\" in the US. For example: you would want to enter $5.00 max as 500.",
      optional: true,
    },
    parkingPayWith: {
      type: "string",
      label: "Parking Pay With",
      description: "How is the Client going to cover parking reimbursement?",
      options: constants.PARKING_PAY_WITH,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tidy.createAddress({
      data: {
        address: this.address,
        unit: this.unit,
        postal_code: this.postalCode,
        city: this.city,
        country_code: this.countryCode,
        address_name: this.addressName,
        parking: {
          paid_parking: this.paidParking,
          parking_spot: this.parkingSpot,
          parking_notes: this.parkingNotes,
          max_parking_cost: this.maxParkingCost,
          parking_pay_with: this.parkingPayWith,
        },
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created address with ID ${response.id}.`);
    }

    return response;
  },
};
