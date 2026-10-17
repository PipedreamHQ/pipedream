// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-trigger-update",
  name: "Trigger Update",
  description: "Trigger an update for a project. Returns a `statusId` — use **Get Update Status** to poll for completion. [See the documentation](https://www.mintlify.com/docs/api-reference/update/trigger)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mintlify,
  },
  async run({ $ }) {
    const response = await this.mintlify.triggerUpdate({
      $,
    });

    $.export("$summary", `Successfully triggered an update for project ${this.mintlify.$auth.project_id} — status ID: ${response.statusId}`);

    return response;
  },
};
