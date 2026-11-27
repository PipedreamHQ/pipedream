import looot from "../../looot.app.mjs";

export default {
  key: "looot-get-operation",
  name: "Get Operation",
  description: "Read the exact inputs, output and price of an endpoint or job. Free. Use **Search Catalog** to find an endpoint ID, then **Run Operation** to run it. [See the documentation](https://docs.looot.ai)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    looot,
    endpointId: {
      propDefinition: [
        looot,
        "endpointId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.looot.getOperation({
      $,
      endpointId: this.endpointId,
    });
    $.export("$summary", `Fetched operation ${this.endpointId}`);
    return response;
  },
};
