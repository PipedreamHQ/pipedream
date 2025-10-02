import codescene from "../../codescene.app.mjs";

export default {
  key: "codescene-get-project-analysis",
  name: "Get Project Analysis",
  description: "Returns a single project analysis. [See the documentation](https://codescene.io/docs/integrations/public-api.html#single-analysis-details)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    codescene,
    projectId: {
      propDefinition: [
        codescene,
        "projectId",
      ],
    },
    analysisId: {
      propDefinition: [
        codescene,
        "analysisId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const projectAnalysis = await this.codescene.getProjectAnalysis({
      $,
      projectId: this.projectId,
      analysisId: this.analysisId,
    });

    $.export("$summary", `Successfully retrieved analysis details for project ID ${this.projectId} and analysis ID ${this.analysisId}`);
    return projectAnalysis;
  },
};
