const axios = require("axios");
const includes = require("lodash.includes");

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
      }
    },
    // https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist
    async getMyRecordings(includeAudioRecordings = false) {
      let next_page_token;
      const files = [];
      do {
        const recordingData = await this._makeRequest("/users/me/recordings");
        next_page_token = recordingData.next_page_token;
        const { meetings } = recordingData;
        if (!meetings || !meetings.length) {
          return [];
        }
        for (const meeting of meetings) {
          if (meeting.recording_count === 0) continue;
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
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    zoom,
  },
  async run(event) {
    // Zoom attaches a UUID to every recording. We keep track of recordings that
    // have finished processing so we don't emit duplicate recordings to listeners
    const recordingIDs = this.db.get("recordingIDs") || [];
    const recordings = await this.zoom.getMyRecordings();
    console.log(recordings);
    for (const recording of recordings) {
      if (includes(recordingIDs, recording.id)) {
        continue;
      }
      const { id, meeting_topic, file_type, recording_end } = recording;
      this.$emit(recording, {
        summary: `${meeting_topic} — ${file_type}`,
        id,
        ts: +new Date(recording_end),
      });
    }
    this.db.set("recordingIDs", recordingIDs);
  },
};
