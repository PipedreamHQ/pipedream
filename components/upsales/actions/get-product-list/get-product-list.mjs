import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-product-list",
  name: "Get Product List",
  description: "Retrieves a list of products from Upsales. [See the documentation](https://api.upsales.com/#378f1b2f-11ce-409a-bf89-ee9f3dda854c)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listProducts({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} product(s)`);
    return response;
  },
};
