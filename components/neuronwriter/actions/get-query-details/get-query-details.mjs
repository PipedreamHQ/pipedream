import neuronwriter from "../../neuronwriter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neuronwriter-get-query-details",
  name: "Get Query Details",
  description: "Fetches the data related to a pre-defined query. `status='ready'` infers that the results of the query are prepared and available.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    neuronwriter,
    queryId: neuronwriter.propDefinitions.queryId,
  },
  async run({ $ }) {
    const response = await this.neuronwriter.getQueryResults({
      queryId: this.queryId,
    });

    // Check if the query status is 'ready' and return the results
    if (response.status === "ready") {
      $.export("$summary", `Successfully fetched query details for Query ID: ${this.queryId}`);
      return response.data;
    } else {
      throw new Error(`Query is not ready. Current status: ${response.status}`);
    }
  },
};
