// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-design-import-job",
  name: "Get Design Import Job",
  description: "Check the status/result of a design import job via GET /imports/{jobId} as a standalone lookup (no need for the original create step in the same execution). Run **Create Design Import Job** first to obtain the job ID. [See the documentation](https://www.canva.dev/docs/connect/api-reference/design-imports/get-design-import-job/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    importId: {
      type: "string",
      label: "Import Job ID",
      description: "The ID of the design import job (e.g. `imp_abc123xyz`). Run **Create Design Import Job** first to obtain it. Maps to path param jobId.",
    },
  },
  async run({ $ }) {
    const response = await this.canva.getDesignImportJob({
      $,
      importId: this.importId,
    });
    $.export("$summary", `Import job "${this.importId}" status: ${response.job?.status ?? "unknown"}`);
    return response;
  },
};
