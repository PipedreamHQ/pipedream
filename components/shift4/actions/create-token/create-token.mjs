import shift4 from "../../shift4.app.mjs";

export default {
  key: "shift4-create-token",
  name: "Create Token",
  description: "Creates a new token object. [See the documentation](https://dev.shift4.com/docs/api#token-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shift4,
    number: {
      type: "string",
      label: "Card Number",
      description: "Card number without any separators.",
    },
    expMonth: {
      type: "string",
      label: "Expiration Month",
      description: "Card expiration month.",
    },
    expYear: {
      type: "string",
      label: "Expiration Year",
      description: "Card expiration year.",
    },
    cvc: {
      type: "string",
      label: "CVC",
      description: "Card security code.",
    },
    cardholderName: {
      type: "string",
      label: "Cardholder Name",
      description: "Name of the cardholder.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of the address.",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of the address.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "City of the address.",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "State",
      description: "State of the address.",
      optional: true,
    },
    addressZip: {
      type: "string",
      label: "Zip Code",
      description: "Zip code of the address.",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "Country represented as a three-letter ISO country code.",
      optional: true,
    },
    fraudCheckData: {
      type: "object",
      label: "Fraud Check Data",
      description: "Additional data used for fraud protection.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      shift4,
      fraudCheckData,
      ...data
    } = this;

    const fraudCheck = fraudCheckData
      ? JSON.stringify(fraudCheckData)
      : undefined;

    const response = await shift4.createToken({
      $,
      data: {
        ...data,
        fraudCheckData: fraudCheck,
      },
    });

    $.export("$summary", `Successfully created token with Id: '${response.id}'`);
    return response;
  },
};
