import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-company-id-lookup",
  name: "Get Company ID Lookup",
  description: "Look up the vanity ID of a company by its numeric ID. Cost: 0 credits. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    id: {
      type: "string",
      label: "Numeric Company ID",
      description: "The company's internal, immutable numeric ID (e.g., `1441` for Google).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company/resolve-id",
      params: {
        id: this.id,
      },
    });
    $.export("$summary", `Successfully resolved company ID ${this.id}`);
    return response;
  },
};
