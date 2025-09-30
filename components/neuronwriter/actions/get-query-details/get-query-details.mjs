import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  key: "neuronwriter-get-query-details",
  name: "Get Query Details",
  description: "Fetches the data related to a pre-defined query. [See the documentation](https://contadu.crisp.help/en/article/neuronwriter-api-how-to-use-2ds6hx/#3-get-query)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    neuronwriter,
    queryId: {
      propDefinition: [
        neuronwriter,
        "queryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.neuronwriter.getQueryResults({
      data: {
        query: this.queryId,
      },
    });

    let summary = `Successfully fetched query details for Query ID: ${this.queryId}`;
    if (response.status != "ready") {
      summary = `Query is not ready. Current status: ${response.status}`;
    }

    $.export("$summary", summary);
    return response;
  },
};
