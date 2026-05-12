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
      buffer = await this.app.downloadReport({
        $,
        requestGuid: this.requestGuid,
      });
    } catch (err) {
      // Re-throw a clean message to avoid binary error data overflowing MCP context
      const status = err.response?.status;
      const msg = status === 404
        ? `Report not found for request ${this.requestGuid}. Verify the GUID is correct and the request has reached 'completed' status.`
        : `Failed to download report for request ${this.requestGuid}: HTTP ${status ?? "unknown"}`;
      throw new Error(msg);
    }
    $.export("$summary", `Downloaded PDF report for request ${this.requestGuid}`);
    return Buffer.from(buffer);
  },
};
