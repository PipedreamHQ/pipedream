import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-new-recording-transcript-completed",
  name: "New Recording Transcript Completed (Instant)",
  description: "Emit new event each time a recording transcript is completed",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    apphook: {
      type: "$.interface.apphook",
      appProp: "app",
      eventNames() {
        return [
          constants.CUSTOM_EVENT_TYPES.RECORDING_TRANSCRIPT_COMPLETED,
        ];
      },
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.app.listMeetings({
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
    ...common.methods,
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
    if (event.event !== constants.CUSTOM_EVENT_TYPES.RECORDING_TRANSCRIPT_COMPLETED) {
      console.log("Not a recording.transcript.completed event. Exiting");
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
