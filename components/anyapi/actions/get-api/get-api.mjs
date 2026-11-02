import anyapi from "../../anyapi.app.mjs";

export default {
  key: "anyapi-get-api",
  name: "Get API",
  description: "Get one API from the AnyAPI catalog, including its normalized input and output JSON Schema and its USD pricing. Run **Search APIs** first to find the API you want; the slug it returns is what the API prop takes, and that slug is the only thing selecting which API you get back. Read `inputSchema` in the response and build the Input of **Run API** from it, because AnyAPI checks the input against that schema and refuses a request that does not match. [See the documentation](https://getanyapi.com/docs/api-reference/get-one-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    anyapi,
    sku: {
      propDefinition: [
        anyapi,
        "sku",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.anyapi.getApi({
      $,
      sku: this.sku,
    });

    $.export("$summary", `Retrieved the definition of \`${this.sku}\``);
    return response;
  },
};
