import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-phone-number-validator",
  name: "Phone Number Validator",
  description: "Check whether a phone number is valid or not. [See the documentation](https://docs.apiverve.com/api/phonenumbervalidator)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    apiverve,
    number: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to validate",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country code of the phone number (e.g., us, uk)",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.phoneNumberValidator({
      $,
      params: {
        number: this.number,
        country: this.country,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved validation info for ${this.number}`);
    }
    return response;
  },
};
