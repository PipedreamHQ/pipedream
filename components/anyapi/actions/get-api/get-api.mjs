import anyapi from "../../anyapi.app.mjs";

export default {
  key: "anyapi-get-api",
  name: "Get API",
  description: "Get one API from the AnyAPI catalog, including its normalized input and output JSON Schema and its USD pricing. [See the documentation](https://getanyapi.com/docs/api-reference/get-one-api)",
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
