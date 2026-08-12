// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";

export default {
  key: "amplitude-request-cohort-download",
  name: "Request Cohort Download",
  description: "Start a behavioral cohort download job (step 1 of 3: request -> status -> download, per Amplitude's Behavioral Cohorts Download API). Returns a `request_id` — pass it to **Get Cohort Download Status** to poll until the job completes, then to **Download Cohort File** to fetch the member list. Use **List Cohorts** first to discover valid cohort IDs. Example: call with `cohortId=\"abc123\"` -> returns `{request_id: \"req_456\", cohort_id: \"abc123\"}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#get-one-cohort).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cohortId: {
      type: "string",
      label: "Cohort ID",
      description: "The ID of the cohort to download. This is a free-form string; run **List Cohorts** first to discover valid cohort IDs. Example: `abc123`.",
    },
    includeProperties: {
      type: "boolean",
      label: "Include User Properties",
      description: "When `true`, include each member's user properties in the downloaded file (the `props` param). If Property Keys is left empty, all available properties are returned. Leave unset for large cohorts that may time out when properties are requested.",
      optional: true,
    },
    propertyKeys: {
      type: "string[]",
      label: "Property Keys",
      description: "Specific user properties to include per member (the `propKeys` param). Only used when Include User Properties is `true`; if left empty, all available properties are returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.requestCohortDownload({
      $,
      cohortId: this.cohortId,
      props: this.includeProperties
        ? 1
        : undefined,
      propKeys: this.includeProperties
        ? this.propertyKeys
        : undefined,
    });
    $.export("$summary", `Started cohort download request ${response.request_id} for cohort ${this.cohortId}`);
    return response;
  },
};
