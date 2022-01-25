/* eslint-disable camelcase */
import axios from "axios";
import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-recording-completed",
  name: "Recording Completed",
  description:
    "Emits an event each time a new recording completes for a meeting or webinar where you're the host",
  version: "0.0.5",
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "recording.completed",
      ],
    },
    meetingIds: {
      type: "integer[]",
      label: "Meeting Filter",
      description: "Optionally filter for events for one or more meetings.",
      async options({ page }) {
        const data = await this.listMeetings(page);
        return data.meetings.map((meeting) => {
          return {
            label: `${meeting.topic} (${meeting.id})`,
            value: meeting.id,
          };
        });
      },
      optional: true,
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
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
  methods: {
    async listMeetings({ page }) {
      const config = {
        method: "get",
        url: "https://api.zoom.us/v2//users/me/meetings",
        headers: {
          Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
        },
        params: {
          page_number: page + 1,
        },
      };
      return (await axios(config)).data;
    },
  },
  async run(event) {
    if (event.event !== "recording.completed") {
      console.log("Not a recording.completed event. Exiting");
      return;
    }
    const { payload } = event;
    const {
      object,
      download_token,
    } = payload;
    const {
      recording_files,
      host_id,
      host_email,
    } = object;
    if (!recording_files || recording_files.length === 0) {
      console.log("No files in recording. Exiting");
      return;
    }

    if (this.meetingIds && this.meetingIds.length > 0 && !this.meetingIds.includes(object.id)) {
      console.log("Meeting ID does not match the filter rules.");
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
          download_url_with_token: `${file.download_url}?access_token=${download_token}`,
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
