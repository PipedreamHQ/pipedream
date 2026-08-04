// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-get-update-status",
  name: "Get Update Status",
  description: "Get the status of a previously triggered documentation update or preview deployment. Use **Trigger Update** or **Trigger Preview Deployment** to obtain a `statusId` to poll. The `status` field reaches one of four values: `queued`, `in_progress`, `success`, or `failure` — stop polling once it reaches `success` or `failure`. [See the documentation](https://www.mintlify.com/docs/api-reference/update/status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The status ID returned by **Trigger Update** or **Trigger Preview Deployment**.",
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.getUpdateStatus({
      $,
      statusId: this.statusId,
    });

    $.export("$summary", `Update status ${this.statusId}: "${response.status}"`);

    return response;
  },
};
