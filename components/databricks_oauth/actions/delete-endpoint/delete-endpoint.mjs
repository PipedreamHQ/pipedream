import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-delete-endpoint",
  name: "Delete Endpoint",
  description: "Delete a vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/deleteendpoint)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.databricks_oauth.deleteEndpoint({
      endpointName: this.endpointName,
      $,
    });

    $.export("$summary", `Successfully deleted endpoint "${this.endpointName}".`);
    return response;
  },
};
