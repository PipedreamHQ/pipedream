import { ConfigurationError } from "@pipedream/platform";
import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-get-upload-status",
  name: "Get Upload Status",
  description: "Get the overall status (`pending`, `processing`, `completed`, `failed`…) and the per-platform results, including post URLs, of an upload."
    + " Pass the `request_id` returned by **Upload Video**, **Upload Photos** or **Upload Text**, or the `job_id` of a scheduled post (see **List Scheduled Posts**)."
    + " Use **Get Upload History** for uploads older than the current request. [See the documentation](https://docs.upload-post.com/api/upload-status)",
  version: "0.0.1",
  ai: "optimized",
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
      description: "The `request_id` returned by **Upload Video**, **Upload Photos** or **Upload Text**, e.g. `req_123`. Provide either `requestId` or `jobId`.",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "The `job_id` of a scheduled or queued post, e.g. `a1b2c3d4e5f67890a1b2c3d4e5f67890`. Use **List Scheduled Posts** to find it (the `job_id` field). Provide either `requestId` or `jobId`.",
    },
  },
  async run({ $ }) {
    if (!this.requestId && !this.jobId) {
      throw new ConfigurationError("Provide either `requestId` or `jobId`");
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
