import visualping from "../../visualping.app.mjs";

export default {
  key: "visualping-delete-job",
  name: "Delete Job",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Permanently deletes a Visualping job by id. This stops monitoring and"
    + " cannot be undone — use **Find Jobs** first to confirm you have the right"
    + " `jobId` before calling this, especially if the user described the job by"
    + " name or URL rather than by id."
    + " Example: after confirming job `482913` is the one monitoring"
    + " `https://example.com/pricing`, call with `jobId=\"482913\"` → the job stops"
    + " being checked and no longer appears in **Find Jobs**."
    + " [See the documentation](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/delete)",
  type: "action",
  ai: "optimized",
  props: {
    visualping,
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
      optional: true,
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const {
      visualping,
      jobId,
      workspaceId,
    } = this;

    const response = await visualping.deleteJob({
      jobId,
      workspaceId,
    });

    $.export("$summary", `Job with id ${jobId} successfully deleted!`);
    return response;
  },
};
