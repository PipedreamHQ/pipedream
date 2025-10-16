import coldstream from "../../diabatix_coldstream.app.mjs";

export default {
  key: "diabatix_coldstream-fetch-simulation-results",
  name: "Fetch Simulation Results",
  description: "Retrieves the result of a specific simulation from ColdStream. [See the documentation](https://coldstream.readme.io/reference/get_cases-result-caseid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coldstream,
    organizationId: {
      propDefinition: [
        coldstream,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    caseId: {
      propDefinition: [
        coldstream,
        "caseId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coldstream.getCaseResults({
      $,
      caseId: this.caseId,
    });
    $.export("$summary", `Successfully retrieved simulation results for case ID ${this.caseId}`);
    return response;
  },
};
