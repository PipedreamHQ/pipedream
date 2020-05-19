const ZOOM_BASE_URL = "https://api.zoom.us/v2";

// TODO: extract into npm package
async function _makeRequest(baseURL, path, config = {}, token) {
  config.url = `${baseURL}${path}`;
  if (!config.headers) config.headers = {};
  config.headers.authorization = `Bearer ${token}`;
  try {
    return (await axios(config)).data;
  } catch (err) {
    console.log(`Error making request to API: ${err}`);
    throw err;
  }
}

// Zoom app
// TODO: move to new file (blocked on local require)
const zoom = {
  type: "app",
  app: "zoom",
  methods: {
    async _makeRequest(path, config) {
      return await _makeRequest(
        ZOOM_BASE_URL,
        path,
        config,
        this.$auth.oauth_access_token
      );
    },
    // https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user
    async getMe() {
      return await this._makeRequest("/users/me");
    },
  },
};

module.exports = {
  name: "Completed Recordings for My Meetings and Webinars",
  version: "0.0.1",
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
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
