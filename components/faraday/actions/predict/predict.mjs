import faraday from "../../faraday.app.mjs";

export default {
  key: "faraday-predict",
  name: "Predict",
  description: "Returns a prediction about a single person. [See the documentation](https://faraday.ai/developers/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    faraday,
    personData: {
      type: "object",
      label: "Person's Data",
      description: "The data of the person for whom prediction is to be generated",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.faraday.generatePrediction(this.personData);
    $.export("$summary", "Prediction generated successfully");
    return response;
  },
};
