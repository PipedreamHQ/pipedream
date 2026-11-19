import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-get-pipeline",
  name: "Get Pipeline",
  description: "Get a Cavyro pipeline with its ordered `stages` (`id`, `name`, `stage_type`). Use it to find `stageId` values for **Create Deal** and **Update Deal**. Use **List Pipelines** to find `pipelineId`. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cavyro,
    pipelineId: {
      propDefinition: [
        cavyro,
        "pipelineId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cavyro.getPipeline({
      $,
      pipelineId: this.pipelineId,
    });
    $.export("$summary", `Retrieved pipeline ${response.id}: ${response.name} (${response.stages?.length ?? 0} stages)`);
    return response;
  },
};
