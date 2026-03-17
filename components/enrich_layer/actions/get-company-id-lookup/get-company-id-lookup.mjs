import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-company-id-lookup",
  name: "Get Company ID Lookup",
  description: "Look up the vanity ID of a company by its numeric ID. Cost: 0 credits. [See the documentation](https://enrichlayer.com/docs/api/v2/company-api/company-id-lookup).",
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
    const response = await this.enrichlayer.getCompanyIdLookup({
      $,
      params: {
        id: this.id,
      },
    });
    $.export("$summary", `Successfully resolved company ID ${this.id}`);
    return response;
  },
};
