import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-street-address-parser",
  name: "Street Address Parser",
  description: "Parse a US street addresses and return the parsed components of the street address provided. [See the documentation](https://docs.apiverve.com/api/streetaddressparser)",
  version: "0.0.1",
  type: "action",
  props: {
    apiverve,
    address: {
      type: "string",
      label: "Address",
      description: "The street address to parse",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.streetAddressParser({
      $,
      params: {
        address: this.address,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", "Successfully parsed street address");
    }
    return response;
  },
};
