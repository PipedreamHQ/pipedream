import muapi from "../../muapi.app.mjs";

export default {
  name: "Get Prediction Result",
  version: "0.0.1",
  key: "muapi-get-prediction",
  description: "Check the status and retrieve the output of a prediction by its request ID. [See the documentation](https://docs.muapi.ai)",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    muapi,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The request ID returned when you submitted a generation job (e.g. `req_abc123xyz`).",
    },
  },
  async run({ $ }) {
    const result = await this.muapi.getResult($, this.requestId);
    $.export("$summary", `Prediction status: ${result.status}`);
    return result;
  },
};
