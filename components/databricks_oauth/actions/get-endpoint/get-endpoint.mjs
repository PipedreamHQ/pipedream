import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-endpoint",
  name: "Get Endpoint",
  description: "Get details of a specific vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/getendpoint)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
    endpointName: {
      propDefinition: [
        databricks_oauth,
        "endpointName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.getEndpoint({
      endpointName: this.endpointName,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved endpoint "${this.endpointName}".`);
    }

    return response;
  },
};
