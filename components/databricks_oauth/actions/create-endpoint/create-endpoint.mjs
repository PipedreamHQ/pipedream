import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-create-endpoint",
  name: "Create Endpoint",
  description: "Create a new vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/createendpoint)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    name: {
      type: "string",
      label: "Endpoint Name",
      description: "The name of the vector search endpoint",
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.createEndpoint({
      data: {
        name: this.name,
        endpoint_type: "STANDARD",
      },
      $,
    });
    $.export("$summary", `Successfully created endpoint with ID ${response.id}.`);
    return response;
  },
};
