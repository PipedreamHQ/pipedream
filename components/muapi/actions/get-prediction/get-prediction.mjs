import muapi from "../../muapi.app.mjs";

export default {
  name: "Get Prediction Result",
  version: "0.1.0",
  key: "muapi-get-prediction",
  description: "Check the status and retrieve the output of a prediction by its request ID. [See the documentation](https://docs.muapi.ai)",
  type: "action",
  props: {
    muapi,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The request ID returned when you submitted a generation job.",
    },
  },
  async run({ $ }) {
    const result = await this.muapi.getResult($, this.requestId);
    $.export("$summary", `Prediction status: ${result.status}`);
    return result;
  },
};
