// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-request-recording-download",
  name: "Request Recording Download",
  description: "Request a downloadable video/audio file for a recording. The initial response may already have `status: completed` with the signed download URL included (common for audio-only recordings, which finish synchronously) — use that URL right away in this case. Otherwise the response returns `status: processing` and a `download_id`; use **Get Recording Download Status** to poll until the status is no longer `processing`. Stop polling on `completed` (signed download URL is included) or on `failed` (inspect the returned failure reason instead of continuing to poll), or provide a `Destination URL` to have Fathom POST the completed payload there instead of polling. [See the documentation](https://developers.fathom.ai/api-reference/recordings/request-a-download)",
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
