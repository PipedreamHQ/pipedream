import seven from "../../seven.app.mjs";

export default {
  key: "seven-lookup-cnam",
  name: "Lookup CNAM",
  description: "Look up caller name information via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/lookup#cnam)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    seven,
    number: {
      propDefinition: [
        seven,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.seven.lookupCnam({
      $,
      params: {
        number: this.number,
      },
    });
    if (response.success) {
      $.export("$summary", `Successfully looked up caller information for number: ${this.number}`);
    }
    return response;
  },
};
