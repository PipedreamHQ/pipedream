import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  key: "neuronwriter-get-content-saved",
  name: "Get Content Saved",
  description: "Pulls the most recent revision of the content saved for a specific query. [See the documentation](https://contadu.crisp.help/en/article/neuronwriter-api-how-to-use-2ds6hx/#3-get-content)",
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
    const response = await this.neuronwriter.getContent({
      $,
      data: {
        query: this.queryId,
      },
    });
    $.export("$summary", `Successfully retrieved the content for query ID ${this.queryId}`);
    return response;
  },
};
