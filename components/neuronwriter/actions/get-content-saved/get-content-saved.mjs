import neuronwriter from "../../neuronwriter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neuronwriter-get-content-saved",
  name: "Get Content Saved",
  description: "Pulls the most recent revision of the content saved for a specific query. [See the documentation]()",
  version: "0.0.1",
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
      queryId: this.queryId,
    });
    $.export("$summary", `Successfully retrieved the content for query ID ${this.queryId}`);
    return response;
  },
};
