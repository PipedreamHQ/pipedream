import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-endpoint",
  name: "Get Endpoint",
  description: "Get details of a specific vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/getendpoint)",
  version: "0.0.3",
  type: "action",
  props: {
    databricks,
    endpointName: {
      propDefinition: [
        databricks,
        "endpointName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks.getEndpoint({
      endpointName: this.endpointName,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved endpoint "${this.endpointName}".`);
    }

    return response;
  },
};
