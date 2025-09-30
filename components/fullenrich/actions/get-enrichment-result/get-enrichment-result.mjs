import app from "../../fullenrich.app.mjs";

export default {
  key: "fullenrich-get-enrichment-result",
  name: "Get Enrichment Result",
  description: "Get the enrichment result for a specified contact. [See the documentation](https://docs.fullenrich.com/getbulk).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    enrichmentId: {
      type: "string",
      label: "Enrichment ID",
      description: "The ID of the enrichment to get the result for.",
    },
    forceResults: {
      type: "boolean",
      label: "Force Results",
      description: "This parameter forces the API to return what has been found so far, even if the enrichment is not finished. This may result in missing information and is not recommended for regular use.",
      optional: true,
    },
  },
  methods: {
    getEnrichmentResult({
      enrichmentId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/contact/enrich/bulk/${enrichmentId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getEnrichmentResult,
      enrichmentId,
      forceResults,
    } = this;

    const response = await getEnrichmentResult({
      $,
      enrichmentId,
      params: {
        forceResults,
      },
    });

    $.export("$summary", `Successfully fetched enrichment result with ID \`${response.id}\`.`);
    return response;
  },
};
