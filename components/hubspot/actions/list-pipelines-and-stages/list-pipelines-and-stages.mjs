// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-pipelines-and-stages",
  name: "List Pipelines and Stages",
  description:
    "List all pipelines and their stages for deals or tickets. Returns pipeline IDs, labels, and each pipeline's ordered stages with stage IDs and labels. Use this to discover valid `pipeline` and `dealstage` / `hs_pipeline_stage` values before creating or updating deals and tickets. [See the documentation](https://developers.hubspot.com/docs/api/crm/pipelines)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The object type to list pipelines for. Only `deal` and `ticket` have pipelines.",
      options: [
        {
          label: "Deals",
          value: "deal",
        },
        {
          label: "Tickets",
          value: "ticket",
        },
      ],
    },
  },
  async run({ $ }) {
    const { results: pipelines } = await this.hubspot.getPipelines({
      $,
      objectType: this.objectType,
    });

    const output = pipelines.map((pipeline) => ({
      id: pipeline.id,
      label: pipeline.label,
      displayOrder: pipeline.displayOrder,
      stages: (pipeline.stages || [])
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((stage) => ({
          id: stage.id,
          label: stage.label,
          displayOrder: stage.displayOrder,
        })),
    }));

    $.export(
      "$summary",
      `Found ${output.length} pipeline${output.length === 1
        ? ""
        : "s"} for ${this.objectType}s`,
    );
    return output;
  },
};
