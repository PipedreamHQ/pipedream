import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-get-upload-status",
  name: "Get Upload Status",
  description: "Get the status and per-platform results of an async upload (by request ID) or a scheduled post (by job ID). [See the documentation](https://docs.upload-post.com/api/upload-status)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
      description: "The `request_id` returned by an upload. Provide either **Request ID** or **Job ID**.",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "The `job_id` returned when scheduling or queueing a post. Provide either **Request ID** or **Job ID**.",
    },
  },
  async run({ $ }) {
    if (!this.requestId && !this.jobId) {
      throw new Error("Provide either **Request ID** or **Job ID**");
    }
    const response = await this.app.getUploadStatus({
      $,
      params: {
        request_id: this.requestId,
        job_id: this.jobId,
      },
    });
    $.export("$summary", `Upload status: ${response?.status ?? "unknown"}`);
    return response;
  },
};
