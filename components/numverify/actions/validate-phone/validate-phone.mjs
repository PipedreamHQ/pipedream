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
  },
  async run({ $ }) {
    const {
      numverify, number,
    } = this;
    const response = await numverify.validatePhone({
      $,
      number,
    });
    $.export("$summary", `Successfully validated phone number ${number}`);
    return response;
  },
};
