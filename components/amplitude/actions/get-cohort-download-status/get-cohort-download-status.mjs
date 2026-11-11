import app from "../../amplitude.app.mjs";

export default {
  key: "amplitude-get-cohort-download-status",
  name: "Get Cohort Download Status",
  description: "Check whether a cohort download job has finished (step 2 of 3: request -> status -> download). Call **Request Cohort Download** first to get a `requestId`. This action polls internally for up to ~35 seconds before returning, since Amplitude's export jobs commonly take 30-60+ seconds regardless of cohort size. If the returned `async_status` is still `JOB INPROGRESS`, call this action again with the same request ID (it may take a few calls) — do not call **Download Cohort File** until `async_status` is `JOB COMPLETED`. Example: call with `requestId=\"req_456\"` -> returns `{request_id: \"req_456\", cohort_id: \"abc123\", async_status: \"JOB COMPLETED\"}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#get-request-status).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.pollCohortDownloadStatus({
      $,
      requestId: this.requestId,
    });
    $.export("$summary", `Cohort download request ${this.requestId} status: ${response.async_status}`);
    return response;
  },
};
