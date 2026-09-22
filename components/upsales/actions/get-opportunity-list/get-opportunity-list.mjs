import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-opportunity-list",
  name: "Get Opportunity List",
  description: "Retrieves a list of opportunities from Upsales. [See the documentation](https://api.upsales.com/#d448e686-69ab-4832-987b-f718abcb8c7e)",
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
    const response = await this.app.listOrders({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
        probability: [
          "gte:1",
          "lte:99",
        ],
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.data?.length || 0} opportunit${response?.data?.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
