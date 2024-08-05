import gami5d from "../../gami5d.app.mjs";

export default {
  key: "gami5d-record-observation",
  name: "Record Observation",
  description: "Record an observation for evaluation in the gami5d platform. [See the documentation](https://app.gami5d.com/web/api/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gami5d,
    observationDetails: {
      propDefinition: [
        gami5d,
        "observationDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gami5d.recordObservation(this.observationDetails);
    $.export("$summary", `Successfully recorded observation with details: ${JSON.stringify(this.observationDetails)}`);
    return response;
  },
};
