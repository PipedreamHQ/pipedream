const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Completed Recordings for My Meetings and Webinars",
  version: "0.0.1",
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      static: ["recording.completed"],
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
      optional: true,
      default: false,
    },
  },
  async run(event) {
    if (event.event !== "recording.completed") {
      console.log("Not a recording.completed event. Exiting");
      return;
    }
    const { download_token, payload } = event;
    const { object } = payload;
    const { recording_files } = object;
    if (!recording_files || recording_files.length === 0) {
      console.log("No files in recording. Exiting");
      return;
    }

    for (const file of recording_files) {
      if (file.status !== "completed") continue;
      // Unless includeAudioRecordings is true, do not include audio recordings
      if (file.file_type === "M4A" && !this.includeAudioRecordings) {
        continue;
      }
      this.$emit(
        {
          download_token,
          ...file,
          meeting_topic: object.topic,
        },
        {
          summary: `${object.topic} — ${file.file_type}`,
          id: file.id,
          ts: +new Date(file.recording_end),
        }
      );
    }
  },
};
