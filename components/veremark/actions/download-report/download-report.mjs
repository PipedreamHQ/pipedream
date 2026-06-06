import fs from "fs";
import app from "../../veremark.app.mjs";

export default {
  key: "veremark-download-report",
  name: "Download Background Check Report",
  description:
    "Downloads the full PDF background check report for a completed request and saves it via File Stash."
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
    syncDir: {
      propDefinition: [
        app,
        "syncDir",
      ],
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const filename = `veremark-report-${this.requestGuid}.pdf`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    let buffer;
    try {
      buffer = await this.app.downloadReport({
        $,
        requestGuid: this.requestGuid,
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 404
        ? `Report not found for request ${this.requestGuid}. Verify the GUID is correct and the request has reached 'completed' status.`
        : status === 403
          ? `Access denied for request ${this.requestGuid}. Check that it belongs to your account.`
          : `Failed to download report for request ${this.requestGuid}: HTTP ${status ?? "unknown"}`;
      $.export("$summary", msg);
      return {
        error: msg,
        requestGuid: this.requestGuid,
      };
    }

    fs.writeFileSync(filePath, Buffer.from(buffer));
    $.export("$summary", `Downloaded PDF report for request ${this.requestGuid} to ${filename}`);
    return {
      filePath,
      filename,
    };
  },
};
