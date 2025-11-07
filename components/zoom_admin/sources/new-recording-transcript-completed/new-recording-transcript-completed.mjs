import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-new-recording-transcript-completed",
  name: "New Recording Transcript Completed (Instant)",
  description: "Emit new event each time a recording transcript is completed",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "recording.transcript_completed",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.zoomAdmin.listMeetings({
        params: {
          from: this.monthAgo(),
          to: new Date().toISOString()
            .slice(0, 10),
          page_size: 25,
        },
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
    monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo.toISOString().slice(0, 10);
    },
    isMeetingRelevant(meeting) {
      return meeting.recording_files && meeting.recording_files.length > 0;
    },
    isFileRelevant(file) {
      return file.file_type === "TRANSCRIPT" && file.status === "completed";
    },
    emitEvent(file, meeting) {
      this.$emit({
        meeting,
        file,
      }, this.generateMeta(file, meeting));
    },
    generateMeta(file, meeting) {
      return {
        id: file.id,
        summary: `Transcript completed for ${meeting.topic}`,
        ts: +new Date(file.recording_end),
      };
    },
  },
  async run(event) {
    if (event.event !== "recording.transcript_completed") {
      console.log("Not a recording.transcript_completed event. Exiting");
      return;
    }
    const { payload } = event;
    const { object } = payload;
    const { recording_files: recordingFiles } = object;

    if (!this.isMeetingRelevant(object)) {
      return;
    }

    for (const file of recordingFiles) {
      if (!this.isFileRelevant(file)) {
        continue;
      }

      this.emitEvent(file, object);
    }
  },
};
