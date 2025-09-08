import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rinkel",
  propDefinitions: {
    callId: {
      type: "string",
      label: "Call ID",
      description: "The ID of the call to get the call detail records for",
      async options({ page }) {
        const response = await this.listCallDetailRecords({
          params: {
            page: page + 1,
            sort: "date",
            sortOrder: "DESC",
          },
        });
        return response.data.map((call) => call.id);
      },
    },
    recordingId: {
      type: "string",
      label: "Recording ID",
      description: "The ID of the recording to get the details for",
      async options({ page }) {
        const response = await this.listCallRecordings({
          params: {
            page: page + 1,
            sort: "date",
            sortOrder: "DESC",
          },
        });
        return response.data.map((recording) => recording.id);
      },
    },
    voicemailId: {
      type: "string",
      label: "Voicemail ID",
      description: "The ID of the voicemail to get the details for",
      async options({ page }) {
        const response = await this.listVoicemails({
          params: {
            page: page + 1,
            sort: "date",
            sortOrder: "DESC",
          },
        });
        return response.data.map((voicemail) => voicemail.id);
      },
    },
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note to update",
      async options({ callId }) {
        const response = await this.getCallDetailRecord({
          id: callId,
        });
        const notes = response.data.notes;
        return notes.map((note) => ({
          label: note.content,
          value: note.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rinkel.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-rinkel-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    createWebhook({
      event, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${event}`,
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      event, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${event}`,
        method: "DELETE",
        ...opts,
      });
    },
    getCallDetailRecord({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/call-detail-records/${id}`,
        ...opts,
      });
    },
    getCallRecording({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${id}`,
        ...opts,
      });
    },
    getVoicemail({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/voicemails/${id}/stream`,
        ...opts,
      });
    },
    listCallDetailRecords(opts = {}) {
      return this._makeRequest({
        path: "/call-detail-records",
        ...opts,
      });
    },
    listCallRecordings(opts = {}) {
      return this._makeRequest({
        path: "/recordings",
        ...opts,
      });
    },
    listVoicemails(opts = {}) {
      return this._makeRequest({
        path: "/voicemails",
        ...opts,
      });
    },
    addNote({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/call-detail-records/${id}/note`,
        method: "PUT",
        ...opts,
      });
    },
    updateNote({
      callId, noteId, ...opts
    }) {
      return this._makeRequest({
        path: `/call-detail-records/${callId}/note/${noteId}`,
        method: "PATCH",
        ...opts,
      });
    },
  },
};
