const axios = require("axios");

const BASE_URL = "https://api.zoom.us/v2";

const zoom = {
  type: "app",
  app: "zoom",
  methods: {
    async _makeRequest(path, config = {}) {
      config.url = `${BASE_URL}${path}`;
      if (!config.headers) config.headers = {};
      config.headers.authorization = `Bearer ${this.$auth.oauth_access_token}`;
      try {
        return (await axios(config)).data;
      } catch (err) {
        console.log(`Error making request to the Zoom API: ${err}`);
        throw err;
      }
    },
    // https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist
    async getMyRecordings(includeAudioRecordings = false) {
      let next_page_token;
      const files = [];
      do {
        const recordingData = await this._makeRequest("/users/me/recordings", {
          params: {
            next_page_token,
          },
        });
        next_page_token = recordingData.next_page_token;
        const { meetings } = recordingData;
        if (!meetings || !meetings.length) {
          return [];
        }
        for (const meeting of meetings) {
          if (meeting.recording_count === 0) {
            continue;
          }
          const { recording_files } = meeting;
          if (!recording_files) continue;
          for (const file of recording_files) {
            if (file.status !== "completed") continue;
            // Unless includeAudioRecordings is true, do not include audio recordings
            if (file.file_type === "M4A" && !includeAudioRecordings) {
              continue;
            }
            files.push({
              ...file,
              meeting_topic: meeting.topic,
            });
          }
        }
      } while (next_page_token);

      return files;
    },
  },
};

// See https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist
// for the full API docs on retrieving recordings for a given user account
module.exports = {
  name: "zoom-recordings",
  version: "0.0.1",
  dedupe: "unique", // This dedupes recordings based on the recording UUID Zoom returns
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    zoom,
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
      optional: true,
      default: false,
    },
  },
  async run() {
    const recordings = await this.zoom.getMyRecordings(
      this.includeAudioRecordings
    );
    console.log(recordings);
    for (const recording of recordings) {
      const { id, meeting_topic, file_type, recording_end } = recording;
      this.$emit(recording, {
        summary: `${meeting_topic} — ${file_type}`,
        id,
        ts: +new Date(recording_end),
      });
    }
  },
};
