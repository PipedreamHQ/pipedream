// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import { parseCohortDownload } from "../../common/utils.mjs";

export default {
  key: "amplitude-download-cohort-file",
  name: "Download Cohort File",
  description: "Download a completed cohort export's member list (step 3 of 3: request -> status -> download). Call **Request Cohort Download** then **Get Cohort Download Status** first, and only call this once status is `JOB COMPLETED` — calling it earlier will fail. Returns one record per member (`amplitude_id`/`user_id`, plus any requested user properties) — not the cohort's own metadata (name, size, definition); use **List Cohorts** for that. Example: call with `requestId=\"req_456\"` -> returns `{requestId: \"req_456\", memberCount: 4200, members: [{amplitude_id: \"123456789\", user_id: \"user@example.com\"}, ...]}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#download-cohort).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The `request_id` returned by **Request Cohort Download**, after **Get Cohort Download Status** reports `JOB COMPLETED`.",
    },
  },
  async run({ $ }) {
    const file = await this.app.downloadCohortFile({
      $,
      requestId: this.requestId,
    });
    const members = parseCohortDownload(file);
    $.export("$summary", `Successfully downloaded ${members.length} member(s) for request ${this.requestId}`);
    return {
      requestId: this.requestId,
      memberCount: members.length,
      members,
    };
  },
};
