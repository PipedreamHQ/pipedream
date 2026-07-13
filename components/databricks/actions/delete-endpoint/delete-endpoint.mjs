import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-delete-endpoint",
  name: "Delete Endpoint",
  description: "Delete a vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/deleteendpoint)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.databricks.deleteEndpoint({
      endpointName: this.endpointName,
      $,
    });

    $.export("$summary", `Successfully deleted endpoint "${this.endpointName}".`);
    return response;
  },
};
