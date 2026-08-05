// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-get-recording-download-status",
  name: "Get Recording Download Status",
  description: "Check the status of a previously requested recording download and, once `completed`, get the signed video/audio download URLs. Use **Request Recording Download** first to obtain a Download ID. [See the documentation](https://developers.fathom.ai/api-reference/recordings/get-download-status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    recordingId: {
      propDefinition: [
        fathom,
        "recordingId",
      ],
    },
    downloadId: {
      type: "string",
      label: "Download ID",
      description: "The ID of the download request, returned by **Request Recording Download**, e.g. `dl_CJAj1YPuruCgWHaKgEBv6Mb1UsNj8x`.",
    },
  },
  async run({ $ }) {
    const response = await this.fathom.getRecordingDownloadStatus({
      $,
      recordingId: this.recordingId,
      downloadId: this.downloadId,
    });
    const detail = response.status === "failed"
      ? ` (${response.failure_reason})`
      : "";
    $.export("$summary", `Download ${this.downloadId} status: ${response.status}${detail}`);
    return response;
  },
};
