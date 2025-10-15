import app from "../../shipengine.app.mjs";

export default {
  key: "shipengine-validate-address",
  name: "Validate An Address",
  description: "Address validation ensures accurate addresses and can lead to reduced shipping costs by preventing address correction surcharges. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/validate_address).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of a contact person at this address.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of a contact person at this address. The format of this phone number varies depending on the country.",
      optional: true,
    },
    cityLocality: {
      type: "string",
      label: "City Or Locality",
      description: "The name of the city or locality.",
    },
    stateProvince: {
      type: "string",
      label: "State Or Province",
      description: "The state or province. For some countries (including the U.S.) only abbreviations are allowed. Other countries allow the full name or abbreviation.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The two-letter [ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1).",
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the street address. For some addresses, this may be the only line. Other addresses may have two or three lines.",
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the street address.",
      optional: true,
    },
    addressLine3: {
      type: "string",
      label: "Address Line 3",
      description: "The third line of the street address.",
      optional: true,
    },
  },
  methods: {
    validateAddress(args = {}) {
      return this.app.makeRequest({
        method: "post",
        path: "/addresses/validate",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      phone,
      cityLocality,
      stateProvince,
      countryCode,
      addressLine1,
      addressLine2,
      addressLine3,
    } = this;

    const response = await this.validateAddress({
      step,
      data: [
        {
          name,
          phone,
          address_line1: addressLine1,
          address_line2: addressLine2,
          address_line3: addressLine3,
          city_locality: cityLocality,
          state_province: stateProvince,
          country_code: countryCode,
        },
      ],
    });

    step.export("$summary", "Successfully validated address");

    return response;
  },
};
