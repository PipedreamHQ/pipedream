import seven from "../../seven.app.mjs";

export default {
  key: "seven-lookup-format",
  name: "Lookup Format",
  description: "Look up phone number formatting via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/lookup#format)",
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
    const response = await this.seven.lookupFormat({
      $,
      params: {
        number: this.number,
      },
    });
    if (response.success) {
      $.export("$summary", `Successfully looked up phone number formatting for number: ${this.number}`);
    }
    return response;
  },
};
