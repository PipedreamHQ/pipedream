// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import { COHORT_DOWNLOAD_MAX_MEMBERS } from "../../common/constants.mjs";
import { parseCohortDownload } from "../../common/utils.mjs";

export default {
  key: "amplitude-download-cohort-file",
  name: "Download Cohort File",
  description: "Download a completed cohort export's member list (step 3 of 3: request -> status -> download). Call **Request Cohort Download** then **Get Cohort Download Status** first, and only call this once status is `JOB COMPLETED` — calling it earlier will fail. Returns one record per member (`amplitude_id`/`user_id`, plus any requested user properties) — not the cohort's own metadata (name, size, definition); use **List Cohorts** for that. Example: call with `requestId=\"req_456\"` -> returns `{requestId: \"req_456\", memberCount: 4200, returnedCount: 4200, truncated: false, members: [{amplitude_id: \"123456789\", user_id: \"user@example.com\"}, ...]}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#download-cohort).",
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
      propDefinition: [
        app,
        "requestId",
      ],
      description: "The `request_id` returned by **Request Cohort Download**, after **Get Cohort Download Status** reports `JOB COMPLETED`. Example: `req_456`.",
    },
    maxMembers: {
      type: "integer",
      label: "Max Members",
      description: `Maximum number of member records to return (the full file is still downloaded and decompressed in memory, so this only caps the returned/reported result — useful to avoid an oversized response for very large cohorts). Defaults to ${COHORT_DOWNLOAD_MAX_MEMBERS}. The true total is always reported in \`memberCount\`, with \`truncated: true\` if it exceeds this cap.`,
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const file = await this.app.downloadCohortFile({
      $,
      requestId: this.requestId,
    });
    const {
      records: members, totalCount, truncated,
    } = await parseCohortDownload(file, {
      maxRecords: this.maxMembers ?? COHORT_DOWNLOAD_MAX_MEMBERS,
    });
    $.export("$summary", `Successfully downloaded ${members.length} of ${totalCount} member(s) for request ${this.requestId}${truncated
      ? " (truncated)"
      : ""}`);
    return {
      requestId: this.requestId,
      memberCount: totalCount,
      returnedCount: members.length,
      truncated,
      members,
    };
  },
};
