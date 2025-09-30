import dropcontact from "../../dropcontact.app.mjs";

export default {
  key: "dropcontact-get-enrichment-request",
  name: "Get Enrichment Request",
  description: "Retrieve the enriched contacts of a request in Dropcontact. [See the documentation](https://developer.dropcontact.com/#get-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dropcontact,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "ID of the request to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.dropcontact.getEnrichmentRequest({
      requestId: this.requestId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved contacts for request ID ${this.requestId}`);
    }

    return response;
  },
};
