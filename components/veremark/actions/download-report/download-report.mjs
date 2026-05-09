import app from "../../veremark.app.mjs";

export default {
  key: "veremark-download-report",
  name: "Download Background Check Report",
  description:
    "Downloads the full PDF background check report for a completed request."
    + " Only available once the request reaches 'completed' status — use **Get Background Check Request** to check status first."
    + " The request GUID is returned when a request is created with **Create Background Check Request**."
    + " [See the documentation](https://api.veremark.com/external/v1/docs/#tag/request/operation/retrieveFullReport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    requestGuid: {
      propDefinition: [
        app,
        "requestGuid",
      ],
    },
  },
  async run({ $ }) {
    let buffer;
    try {
      buffer = await this.app._makeRequest({
        $,
        path: `/request/${this.requestGuid}/report/full`,
        responseType: "arraybuffer",
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 404
        ? "Report not found — the request GUID may be invalid."
        : status === 403
          ? "Access denied — check that this request belongs to your account."
          : status
            ? `The report is not yet available (HTTP ${status}). The background check may still be in progress.`
            : `Failed to download report: ${err.message}`;
      $.export("$summary", msg);
      return {
        error: msg,
        requestGuid: this.requestGuid,
      };
    }

    $.export("$summary", `Downloaded PDF report for request ${this.requestGuid}`);
    return Buffer.from(buffer);
  },
};
