// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-trigger-preview-deployment",
  name: "Trigger Preview Deployment",
  description: "Trigger a preview deployment for a specific Git branch, useful for reviewing documentation changes before they're merged. Returns a `statusId` — use **Get Update Status** to poll for completion — and a `previewUrl` for the hosted preview. Limited to 5 requests per minute per organization; returns a 403 if preview deployments aren't available on your plan. [See the documentation](https://www.mintlify.com/docs/api-reference/preview/trigger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mintlify,
    branch: {
      type: "string",
      label: "Branch",
      description: "The Git branch name to build a preview deployment for, e.g. `feature/new-guide`.",
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.triggerPreviewDeployment({
      $,
      data: {
        branch: this.branch,
      },
    });

    $.export("$summary", `Triggered preview deployment for branch "${this.branch}" — ${response.previewUrl}`);

    return response;
  },
};
