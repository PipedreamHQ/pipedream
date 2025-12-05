import fedex from "../../fedex.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fedex-track-by-reference",
  name: "Track by Reference",
  description: "Tracks a package by reference number. [See the documentation](https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html#operation/Track%20by%20References)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fedex,
    value: {
      type: "string",
      label: "Reference Value",
      description: "The reference value to track",
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "The shipper's account number. Either `accountNumber` or `destinationPostalCode` and `destinationCountryCode` must be provided.",
      optional: true,
    },
    destinationPostalCode: {
      type: "string",
      label: "Destination Postal Code",
      description: "The postal code of the destination. Either `accountNumber` or `destinationPostalCode` and `destinationCountryCode` must be provided.",
      optional: true,
    },
    destinationCountryCode: {
      type: "string",
      label: "Destination Country Code",
      description: "The country code of the destination. Either `accountNumber` or `destinationPostalCode` and `destinationCountryCode` must be provided.",
      optional: true,
    },
    shipDateBegin: {
      propDefinition: [
        fedex,
        "shipDateBegin",
      ],
    },
    shipDateEnd: {
      propDefinition: [
        fedex,
        "shipDateEnd",
      ],
    },
    includeDetailedScans: {
      propDefinition: [
        fedex,
        "includeDetailedScans",
      ],
    },
  },
  async run({ $ }) {
    if (!this.accountNumber && (!this.destinationPostalCode || !this.destinationCountryCode)) {
      throw new ConfigurationError("Either `accountNumber` or `destinationPostalCode` and `destinationCountryCode` must be provided.");
    }
    const response = await this.fedex.trackByReference({
      $,
      data: {
        referencesInformation: {
          value: this.value,
          accountNumber: this.accountNumber,
          destinationPostalCode: this.destinationPostalCode,
          destinationCountryCode: this.destinationCountryCode,
          shipDateBegin: this.shipDateBegin,
          shipDateEnd: this.shipDateEnd,
        },
        includeDetailedScans: this.includeDetailedScans,
      },
    });
    $.export("$summary", `Tracking information for ${this.value} retrieved successfully`);
    return response;
  },
};
