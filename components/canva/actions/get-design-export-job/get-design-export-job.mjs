// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-design-export-job",
  name: "Get Design Export Job",
  description: "Check the status and download URLs of a design export job via GET /exports/{exportId} as a standalone lookup. Run **Export Design** first to obtain the export ID. [See the documentation](https://www.canva.dev/docs/connect/api-reference/exports/get-design-export-job/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    exportId: {
      type: "string",
      label: "Export Job ID",
      description: "The ID of the design export job (e.g. `exp_def456uvw`). Run **Export Design** first to obtain it.",
    },
  },
  async run({ $ }) {
    const response = await this.canva.getDesignExportJob({
      $,
      exportId: this.exportId,
    });
    $.export("$summary", `Export job "${this.exportId}" status: ${response.job?.status ?? "unknown"}`);
    return response;
  },
};
