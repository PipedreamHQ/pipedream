import { ConfigurationError } from "@pipedream/platform";
import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-create-endpoint",
  name: "Create Endpoint",
  description: "Create a new vector search endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/createendpoint)",
  version: "0.0.3",
  type: "action",
  props: {
    databricks,
    name: {
      type: "string",
      label: "Endpoint Name",
      description: "The name of the vector search endpoint",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.databricks.createEndpoint({
        data: {
          name: this.name,
          endpoint_type: "STANDARD",
        },
        $,
      });

      if (response) {
        $.export("$summary", `Successfully created endpoint with ID ${response.id}.`);
      }

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message);
    }
  },
};
