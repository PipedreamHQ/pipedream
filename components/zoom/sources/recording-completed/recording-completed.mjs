import zoom from "../../zoom.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "zoom-recording-completed",
  name: "Recording Completed (Instant)",
  description: "Emit new event each time a new recording completes for a meeting or webinar where you're the host",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "recording.completed",
      ],
    },
    meetingIds: {
      propDefinition: [
        zoom,
        "meetingIds",
      ],
    },
    includeAudioRecordings: {
      propDefinition: [
        zoom,
        "includeAudioRecordings",
      ],
    },
    includeChatTranscripts: {
      propDefinition: [
        zoom,
        "includeChatTranscripts",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.zoom.listRecordings({
        from: this.monthAgo(),
        to: new Date().toISOString()
          .slice(0, 10),
        page_size: 25,
      });
      if (!meetings || meetings.length === 0) {
        return;
      }
      for (const meeting of meetings) {
        if (!this.isMeetingRelevant(meeting)) {
          continue;
        }
        for (const file of meeting.recording_files) {
          if (!this.isFileRelevant(file)) {
            continue;
          }
          this.emitEvent(file, meeting);
        }
      }
    },
  },
  methods: {
    ...common.methods,
    isMeetingRelevant(meeting) {
      const {
        id, recording_files,
      } = meeting;

      if (!recording_files || recording_files.length === 0) {
        console.log("No files in recording. Exiting");
        return false;
      }

      if (this.meetingIds && this.meetingIds.length > 0 && !this.meetingIds.includes(id)) {
        console.log("Meeting ID does not match the filter rules.");
        return false;
      }
      return true;
    },
    isFileRelevant(file) {
      return !((file.status !== "completed")
        || (file.file_type === "M4A" && !this.includeAudioRecordings)
        || (file.file_type === "CHAT" && !this.includeChatTranscripts));
    },
    emitEvent(file, meeting, downloadToken = null) {
      this.$emit(
        {
          download_url_with_token: `${file.download_url}?access_token=${downloadToken}`,
          download_token: downloadToken,
          ...file,
          meeting_id_long: meeting.id, // Long ID is necessary for certain API operations
          meeting_topic: meeting.topic,
          host_id: meeting.host_id,
          host_email: meeting.host_email,
        },
        {
          id: file.id,
          summary: `${meeting.topic} — ${file.file_type}`,
          ts: +new Date(file.recording_end),
        },
      );
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
      download_token: downloadToken,
    } = payload;
    const { recording_files: recordingFiles } = object;

    if (!this.isMeetingRelevant(object)) {
      return;
    }

    for (const file of recordingFiles) {
      if (!this.isFileRelevant(file)) {
        continue;
      }

      this.emitEvent(file, object, downloadToken);
    }
  },
};
