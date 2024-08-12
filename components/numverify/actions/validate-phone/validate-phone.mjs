import numverify from "../../numverify.app.mjs";

export default {
  key: "numverify-validate-phone",
  name: "Validate Phone",
  description: "Validates a phone number. [See the documentation](https://numverify.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    numverify,
    number: {
      type: "string",
      label: "Number",
      description: "It is most efficient to provide phone numbers in a strictly numeric format (e.g. `441179287870`), but NumVerify is also capable of processing numbers containing special characters (e.g. `+44 (0) 117 928 7870`).",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Specify only if working with national (local) phone numbers. 2-digit country code, such as `US`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.numverify.validatePhone({
      $,
      params: {
        number: this.number,
        country_code: this.countryCode,
      },
    });
    $.export("$summary", `Successfully validated phone number ${this.number}`);
    return response;
  },
};
