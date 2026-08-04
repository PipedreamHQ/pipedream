// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-request-recording-download",
  name: "Request Recording Download",
  description: "Request a downloadable video/audio file for a recording. Fathom generates the file asynchronously — the response returns a `processing` status and a `download_id`. Use **Get Recording Download Status** to poll until the file is `completed` and get the signed download URL, or provide a **Destination URL** to have Fathom POST the completed payload there instead of polling. [See the documentation](https://developers.fathom.ai/api-reference/recordings/request-a-download)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fathom,
    recordingId: {
      propDefinition: [
        fathom,
        "recordingId",
      ],
    },
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "A webhook URL where Fathom POSTs the completed download payload once ready, e.g. `https://example.com/destination`. If omitted, poll **Get Recording Download Status** instead.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fathom.requestRecordingDownload({
      $,
      recordingId: this.recordingId,
      data: {
        destination_url: this.destinationUrl,
      },
    });
    $.export("$summary", `Requested download ${response.download_id} for recording ${this.recordingId} (status: ${response.status})`);
    return response;
  },
};
