import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-cancel-scheduled-post",
  name: "Cancel Scheduled Post",
  description: "Cancel a scheduled or queued post before it is published and delete its stored media. The upload credits it reserved are returned (`credits_refunded`)."
    + " Use **List Scheduled Posts** to find the `job_id`. [See the documentation](https://docs.upload-post.com/api/schedule-posts#cancel-a-scheduled-post)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    jobId: {
      propDefinition: [
        app,
        "scheduledJobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.cancelScheduledPost({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully cancelled scheduled post \`${this.jobId}\``);
    return response;
  },
};
