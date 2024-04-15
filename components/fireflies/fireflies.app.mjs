import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fireflies",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The unique identifier for the meeting.",
    },
    audioFile: {
      type: "string",
      label: "Audio File",
      description: "The audio file for the meeting.",
    },
    meetingDetails: {
      type: "object",
      label: "Meeting Details",
      description: "The details of the meeting including participants, date, time, etc.",
    },
    transcriptionOption: {
      type: "boolean",
      label: "Transcription Option",
      description: "Determines whether the uploaded audio will be transcribed.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fireflies.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getMeeting(meetingId) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}`,
      });
    },
    async getRecentMeeting() {
      return this._makeRequest({
        path: "/v1/meetings/recent",
      });
    },
    async createMeeting(audioFile, meetingDetails, transcriptionOption) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/meetings",
        data: {
          audio_file: audioFile,
          meeting_details: meetingDetails,
          transcription_option: transcriptionOption,
        },
      });
    },
    async emitNewMeetingEvent(meetingId) {
      const meeting = await this.getMeeting(meetingId);
      if (meeting.transcripts) {
        this.$emit(meeting, {
          summary: "New meeting with transcripts created",
          id: meeting.id,
          ts: Date.now(),
        });
      }
    },
  },
};
