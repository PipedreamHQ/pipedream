import { TRANSCRIPT_FORMAT_OPTIONS } from "../../common/constants.mjs";
import grain from "../../grain.app.mjs";

export default {
  key: "grain-get-transcript",
  name: "Get Transcript",
  description: "Fetches the full transcript of a Grain recording."
    + " The `json` format returns structured segments with speaker, participant ID, start/end times in milliseconds, and text;"
    + " `txt`, `vtt`, and `srt` return plain text or subtitle formats."
    + " Use **List Recordings** to find recording IDs; use **Get Recording** for the recording's metadata instead of its transcript."
    + " [See the documentation](https://developers.grain.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
    recordingId: {
      propDefinition: [
        grain,
        "recordingId",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format for the transcript",
      options: TRANSCRIPT_FORMAT_OPTIONS,
      default: "json",
    },
  },
  async run({ $ }) {
    const response = await this.grain.fetchTranscript({
      $,
      recordingId: this.recordingId,
      format: this.format,
    });

    $.export("$summary", `Successfully fetched transcript for recording ${this.recordingId}`);
    return response;
  },
};
