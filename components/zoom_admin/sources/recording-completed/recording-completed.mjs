/* eslint-disable camelcase */
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-recording-completed",
  type: "source",
  name: "Recording Completed",
  description: "Emits an event each time a recording is ready for viewing in your Zoom account",
  version: "0.1.9",
  dedupe: "unique", // Dedupe events based on the ID of the recording file
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "recording.completed",
      ],
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to `true` to include audio recordings",
      optional: true,
      default: false,
    },
    includeChatTranscripts: {
      type: "boolean",
      label: "Include Chat Transcripts",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to `true` to include chat transcripts",
      optional: true,
      default: false,
    },
  },
  async run(event) {
    if (event.event !== "recording.completed") {
      console.log("Not a recording.completed event. Exiting");
      return;
    }
    const {
      download_token,
      payload,
    } = event;
    const { object } = payload;
    const {
      recording_files,
      host_id,
      host_email,
    } = object;
    if (!recording_files || recording_files.length === 0) {
      console.log("No files in recording. Exiting");
      return;
    }

    for (const file of recording_files) {
      if (file.status !== "completed") continue;

      if (file.file_type === "M4A" && !this.includeAudioRecordings) {
        continue;
      }
      if (file.file_type === "CHAT" && !this.includeChatTranscripts) {
        continue;
      }

      this.$emit(
        {
          download_token,
          ...file,
          meeting_id_long: object.id, // Long ID is necessary for certain API operations
          meeting_topic: object.topic,
          host_id,
          host_email,
        },
        {
          summary: `${object.topic} — ${file.file_type}`,
          id: file.id,
          ts: +new Date(file.recording_end),
        },
      );
    }
  },
};
