import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grain",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the recording to fetch",
      async options() {
        const recordings = await this.listRecordings();
        return recordings.map((recording) => ({
          value: recording.id,
          label: recording.title,
        }));
      },
    },
    transcriptFormat: {
      type: "string",
      label: "Transcript Format",
      description: "Format for the transcript",
      options: [
        {
          label: "JSON",
          value: "json",
        },
        {
          label: "VTT",
          value: "vtt",
        },
      ],
      optional: true,
    },
    intelligenceNotesFormat: {
      type: "string",
      label: "Intelligence Notes Format",
      description: "Format for the intelligence notes",
      options: [
        {
          label: "JSON",
          value: "json",
        },
        {
          label: "Markdown",
          value: "md",
        },
        {
          label: "Text",
          value: "text",
        },
      ],
      optional: true,
    },
    allowedIntelligenceNotes: {
      type: "string[]",
      label: "Allowed Intelligence Notes",
      description: "Whitelist of intelligence notes section titles",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://grain.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listRecordings(opts = {}) {
      return this._makeRequest({
        path: "/_/public-api/recordings",
        ...opts,
      });
    },
    async fetchRecording({
      recordId, transcriptFormat, intelligenceNotesFormat, allowedIntelligenceNotes, ...opts
    }) {
      return this._makeRequest({
        path: `/_/public-api/recordings/${recordId}`,
        params: {
          transcript_format: transcriptFormat,
          intelligence_notes_format: intelligenceNotesFormat,
          allowed_intelligence_notes: allowedIntelligenceNotes,
        },
        ...opts,
      });
    },
    async emitNewEvent(eventType, entityType) {
      // Logic to emit event - placeholder implementation
      console.log(`Emit ${eventType} event for ${entityType}`);
    },
  },
  hooks: {
    async addedHighlight() {
      await this.emitNewEvent("added", "highlight");
    },
    async addedStory() {
      await this.emitNewEvent("added", "story");
    },
    async addedRecording() {
      await this.emitNewEvent("added", "recording");
    },
    async updatedHighlight() {
      await this.emitNewEvent("updated", "highlight");
    },
    async updatedStory() {
      await this.emitNewEvent("updated", "story");
    },
    async updatedRecording() {
      await this.emitNewEvent("updated", "recording");
    },
    async removedHighlight() {
      await this.emitNewEvent("removed", "highlight");
    },
    async removedStory() {
      await this.emitNewEvent("removed", "story");
    },
    async removedRecording() {
      await this.emitNewEvent("removed", "recording");
    },
  },
};
