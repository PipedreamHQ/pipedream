import amazonAlexa from "../../amazon_alexa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "amazon_alexa-get-simulation-results",
  name: "Get Simulation Results",
  description: "Get the results of the specified simulation for an Alexa skill. [See the documentation](https://developer.amazon.com/en-us/docs/alexa/smapi/skill-simulation-api.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    amazonAlexa,
    skillId: {
      propDefinition: [
        amazonAlexa,
        "skillId",
      ],
    },
    stage: {
      propDefinition: [
        amazonAlexa,
        "stage",
      ],
    },
    simulationId: {
      propDefinition: [
        amazonAlexa,
        "simulationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amazonAlexa.getSimulation({
      skillId: this.skillId,
      stage: this.stage,
      simulationId: this.simulationId,
    });
    $.export("$summary", `Successfully retrieved simulation results for simulation ID: ${this.simulationId}`);
    return response;
  },
};
