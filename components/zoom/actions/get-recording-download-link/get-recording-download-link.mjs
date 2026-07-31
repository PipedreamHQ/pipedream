// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import zoom from "../../zoom.app.mjs";

const DEFAULT_TTL = 900;

export default {
  key: "zoom-get-recording-download-link",
  name: "Get Recording Download Link",
  description: "Generate a temporary, pre-signed download link for one Zoom cloud recording file."
    + " Use to download, fetch, or share a recording."
    + " Call **Get Meeting Recordings** first to list a meeting's files and pass the `id` of the one you want, or omit **Recording File** to get the meeting's main video recording automatically."
    + " Returns `downloadUrl`, `expiresAt`, `expiresInSeconds`, and the file's `recordingId`, `fileType`, `fileExtension`, `fileSize`, and recording start/end timestamps."
    + " **This link contains a credential — anyone who has it can download the file without logging in to Zoom, until it expires.**"
    + " Example: call with meetingId=`84598792483` and no recording file → returns"
    + " `{ downloadUrl: \"https://us02web.zoom.us/rec/download/abc123?access_token=eyJ...\", expiresInSeconds: 900, fileType: \"MP4\", fileSize: 148203910 }`."
    + " [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/recordings)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
        () => ({
          type: "previous_meetings",
        }),
      ],
      description: "The meeting whose recording you want a link for. For a recurring meeting, pass the meeting **UUID** (available from **List All Recordings**) to target a specific occurrence — the numeric meeting ID always returns the most recent one.",
      optional: false,
    },
    recordingFileId: {
      propDefinition: [
        zoom,
        "recordingFileId",
        ({ meetingId }) => ({
          meetingId,
        }),
      ],
    },
    ttl: {
      type: "integer",
      label: "TTL (seconds)",
      description: `How long the link stays valid, in seconds. Defaults to 15 minutes (${DEFAULT_TTL}). Minimum \`60\` (1 minute), maximum \`604800\` (7 days).`,
      optional: true,
      default: DEFAULT_TTL,
      min: 60,
      max: 604800,
    },
  },
  async run({ $: step }) {
    const ttl = this.ttl ?? DEFAULT_TTL;

    const {
      file, recordings,
    } = await this.zoom.getRecordingFile({
      step,
      meetingId: this.meetingId,
      recordingFileId: this.recordingFileId,
      params: {
        include_fields: "download_access_token",
        ttl,
      },
    });

    // On-premise recordings can come back without a `download_url`, and there is nothing
    // to sign a token against — fail rather than return `undefined?access_token=...`.
    if (!file?.download_url) {
      throw new Error(
        `Zoom returned no download URL for the ${file?.file_type ?? "selected"} recording file. `
        + "Files stored on-premise cannot be downloaded through the cloud recording API.",
      );
    }

    // Zoom mints the token at the meeting level, not per file.
    const token = recordings?.download_access_token;
    if (!token) {
      throw new ConfigurationError(
        "Zoom did not return a download access token for this meeting. Cloud recording downloads "
        + "may be restricted by an account-level setting.",
      );
    }

    step.export(
      "$summary",
      `Generated a download link for the ${file.file_type} recording, valid for ${ttl} seconds`,
    );

    // Return the composed URL only — never the bare token, and never the raw Zoom
    // response, which carries every other file's download_url for this meeting.
    return {
      downloadUrl: `${file.download_url}?access_token=${token}`,
      expiresInSeconds: ttl,
      // Approximate: Zoom starts the clock when it mints the token, moments before this runs.
      expiresAt: new Date(Date.now() + (ttl * 1000)).toISOString(),
      recordingId: file.id,
      meetingId: this.meetingId,
      fileType: file.file_type,
      fileExtension: file.file_extension,
      fileSize: file.file_size,
      recordingType: file.recording_type,
      recordingStart: file.recording_start,
      recordingEnd: file.recording_end,
    };
  },
};
