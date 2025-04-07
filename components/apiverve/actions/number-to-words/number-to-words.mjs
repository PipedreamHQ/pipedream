import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-number-to-words",
  name: "Number to Words",
  description: "A simple tool for converting numbers to words. Returns the number in words. [See the documentation](https://docs.apiverve.com/api/numbertowords)",
  version: "0.0.1",
  type: "action",
  props: {
    apiverve,
    number: {
      type: "string",
      label: "Number",
      description: "The number to convert to words",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.numberToWords({
      $,
      params: {
        number: this.number,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", "Successfully converted number to words");
    }
    return response;
  },
};
