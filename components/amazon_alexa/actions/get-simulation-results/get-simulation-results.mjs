import app from "../../amazon_alexa.app.mjs";

export default {
  key: "amazon_alexa-get-simulation-results",
  name: "Get Simulation Results",
  description: "Get the results of the specified simulation for an Alexa skill. [See the documentation](https://developer.amazon.com/en-us/docs/alexa/smapi/skill-simulation-api.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    skillId: {
      propDefinition: [
        app,
        "skillId",
      ],
    },
    stage: {
      propDefinition: [
        app,
        "stage",
      ],
    },
    simulationId: {
      propDefinition: [
        app,
        "simulationId",
      ],
    },
  },
  methods: {
    getSimulationResults({
      skillId, stage, simulationId, ...args
    }) {
      return this.app._makeRequest({
        path: `/skills/${skillId}/stages/${stage}/simulations/${simulationId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getSimulationResults,
      skillId,
      stage,
      simulationId,
    } = this;

    const response = await getSimulationResults({
      $,
      skillId,
      stage,
      simulationId,
    });

    $.export("$summary", `Successfully retrieved simulation results with ID: ${response.id}`);

    return response;
  },
};
