import seven from "../../seven.app.mjs";

export default {
  key: "seven-lookup-hlr",
  name: "Lookup HLR",
  description: "Look up home location register information via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/lookup#hlr)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.seven.lookupHlr({
      $,
      params: {
        number: this.number,
      },
    });
    if (response.success) {
      $.export("$summary", `Successfully looked up location register information for number: ${this.number}`);
    }
    return response;
  },
};
